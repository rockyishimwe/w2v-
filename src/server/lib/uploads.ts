/**
 * Image upload storage.
 *
 * Two backends behind one API, picked by whether a blob token is present:
 *  - Vercel Blob (BLOB_READ_WRITE_TOKEN set) — used on Vercel, where the
 *    filesystem is read-only and per-invocation,
 *  - local disk under ./uploads (gitignored) — zero-config dev, Docker.
 *
 * Either way the public path stays `/api/uploads/<name>`, so stored rows
 * (listing photos, avatars) and the client are backend-agnostic. The GET
 * route redirects to the blob CDN URL when blob storage is active.
 *
 * Security properties:
 *  - filenames are server-generated (random) — user input never touches
 *    the filesystem path or blob pathname,
 *  - content is validated by magic bytes, not just MIME header,
 *  - reads re-validate the name format and resolve inside ./uploads.
 */
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { badRequest, notFound } from "./errors";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_BYTES = 1_400_000; // ~1.4 MB — same cap as scan data URLs

/** Blob pathname prefix (keeps the store tidy if it is shared). */
const BLOB_PREFIX = "uploads";

/** True when uploads should go to Vercel Blob instead of local disk. */
function usingBlobStore(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Allowed image types with their magic-byte signatures. */
const SIGNATURES: Array<{
  ext: string;
  mime: string;
  test: (b: Buffer) => boolean;
}> = [
  {
    ext: "jpg",
    mime: "image/jpeg",
    test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    ext: "png",
    mime: "image/png",
    test: (b) =>
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  {
    ext: "webp",
    mime: "image/webp",
    test: (b) =>
      b.subarray(0, 4).toString("ascii") === "RIFF" &&
      b.subarray(8, 12).toString("ascii") === "WEBP",
  },
  {
    ext: "gif",
    mime: "image/gif",
    // "GIF87a" or "GIF89a"
    test: (b) =>
      b.subarray(0, 4).toString("ascii") === "GIF8" &&
      (b[4] === 0x37 || b[4] === 0x39) &&
      b[5] === 0x61,
  },
];

/** Every extension the store can serve. */
export type UploadExt = "jpg" | "png" | "webp" | "gif";

/** Formats accepted for profile photos (per product spec). */
export const AVATAR_FORMATS: UploadExt[] = ["jpg", "png", "gif"];

const NAME_PATTERN = /^img-[a-z0-9-]+\.(jpg|png|webp|gif)$/;

/** Detects the real image type from magic bytes; null if not an image. */
function detectType(buffer: Buffer) {
  return SIGNATURES.find((signature) => signature.test(buffer)) ?? null;
}

/**
 * Persists an uploaded image and returns its public API path
 * ("/api/uploads/img-xxx.jpg").
 */
export async function saveUpload(
  data: Buffer,
  declaredMime: string,
  options: {
    /** Restricts the accepted formats (default: everything supported). */
    allow?: UploadExt[];
    /** Overrides the size cap, in bytes. */
    maxBytes?: number;
  } = {},
): Promise<{ path: string; mime: string; bytes: number }> {
  const allow = options.allow ?? ["jpg", "png", "webp", "gif"];
  const maxBytes = options.maxBytes ?? MAX_BYTES;
  const limitLabel = `${(maxBytes / 1_000_000).toFixed(1)} MB`;
  const allowLabel = allow
    .map((ext) => (ext === "jpg" ? "JPG" : ext.toUpperCase()))
    .join(", ");

  if (data.length === 0) throw badRequest("Empty file.");
  if (data.length > maxBytes) throw badRequest(`Image exceeds ${limitLabel}.`);

  const type = detectType(data);
  // Magic bytes decide, so renaming a .webp to .png cannot slip through.
  if (!type || !allow.includes(type.ext as UploadExt)) {
    throw badRequest(`Only ${allowLabel} images are accepted.`);
  }
  // Sanity cross-check: browsers send honest MIME types; mismatched ones
  // are still saved by content (magic bytes win), but junk is rejected.
  if (
    declaredMime &&
    !declaredMime.startsWith("image/") &&
    declaredMime !== "application/octet-stream"
  ) {
    throw badRequest("Only image uploads are accepted.");
  }

  const name = `img-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}.${type.ext}`;

  if (usingBlobStore()) {
    const { put } = await import("@vercel/blob");
    await put(`${BLOB_PREFIX}/${name}`, data, {
      access: "public",
      contentType: type.mime,
      // Names are already random and unique; a suffix would break the
      // name → pathname mapping that reads rely on.
      addRandomSuffix: false,
      cacheControlMaxAge: 31_536_000,
    });
  } else {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, name), data);
  }

  return { path: `/api/uploads/${name}`, mime: type.mime, bytes: data.length };
}

/**
 * Resolves a stored name to its blob CDN URL, or null when blob storage
 * is not in use. The GET route redirects there instead of proxying bytes.
 */
export async function uploadUrl(name: string): Promise<string | null> {
  if (!NAME_PATTERN.test(name)) throw notFound("Image not found.");
  if (!usingBlobStore()) return null;

  const { head } = await import("@vercel/blob");
  try {
    const blob = await head(`${BLOB_PREFIX}/${name}`);
    return blob.url;
  } catch {
    throw notFound("Image not found.");
  }
}

/** Reads a stored image by public name; throws 404 when unknown. */
export async function readUpload(
  name: string,
): Promise<{ data: Buffer; mime: string }> {
  // Names are always server-generated: img-<base36>-<base36>.<ext>
  if (!NAME_PATTERN.test(name)) {
    throw notFound("Image not found.");
  }

  if (usingBlobStore()) {
    const url = await uploadUrl(name);
    const response = await fetch(url!).catch(() => null);
    if (!response?.ok) throw notFound("Image not found.");
    const data = Buffer.from(await response.arrayBuffer());
    const type = detectType(data);
    if (!type) throw notFound("Image not found.");
    return { data, mime: type.mime };
  }

  const resolved = path.join(UPLOAD_DIR, name);
  if (path.dirname(resolved) !== UPLOAD_DIR) {
    throw notFound("Image not found.");
  }
  try {
    const data = await readFile(resolved);
    const type = detectType(data);
    if (!type) throw new Error("corrupted");
    return { data, mime: type.mime };
  } catch {
    throw notFound("Image not found.");
  }
}

/** Removes a stored image by public path ("/api/uploads/img-x.jpg"). */
export async function deleteUpload(publicPath: string): Promise<void> {
  const name = publicPath.replace("/api/uploads/", "");
  if (!NAME_PATTERN.test(name)) return;

  if (usingBlobStore()) {
    const { del } = await import("@vercel/blob");
    await del(`${BLOB_PREFIX}/${name}`).catch(() => undefined);
    return;
  }
  await unlink(path.join(UPLOAD_DIR, name)).catch(() => undefined);
}
