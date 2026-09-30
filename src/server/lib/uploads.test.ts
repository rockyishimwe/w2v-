import { afterAll, describe, expect, it } from "vitest";
import { AVATAR_FORMATS, deleteUpload, saveUpload } from "./uploads";

/** Minimal buffers carrying each format's real magic bytes. */
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const GIF = Buffer.concat([Buffer.from("GIF89a", "ascii"), Buffer.alloc(8)]);
const WEBP = Buffer.concat([
  Buffer.from("RIFF", "ascii"),
  Buffer.alloc(4),
  Buffer.from("WEBP", "ascii"),
]);

/** Every file these tests write, removed afterwards. */
const written: string[] = [];

async function save(data: Buffer, mime: string, maxBytes?: number) {
  const saved = await saveUpload(data, mime, {
    allow: AVATAR_FORMATS,
    ...(maxBytes !== undefined ? { maxBytes } : {}),
  });
  written.push(saved.path);
  return saved;
}

afterAll(async () => {
  await Promise.all(written.map((path) => deleteUpload(path)));
});

describe("saveUpload — avatar formats", () => {
  it("accepts JPG, PNG and GIF", async () => {
    for (const [data, ext] of [
      [JPEG, "jpg"],
      [PNG, "png"],
      [GIF, "gif"],
    ] as const) {
      const saved = await save(data, "image/png");
      expect(saved.path).toMatch(new RegExp(`\\.${ext}$`));
    }
  });

  it("rejects a format outside the allow-list", async () => {
    await expect(
      saveUpload(WEBP, "image/webp", { allow: AVATAR_FORMATS }),
    ).rejects.toThrow(/JPG, PNG, GIF/);
  });

  it("ignores a lying MIME type and trusts the magic bytes", async () => {
    // A GIF renamed to .png is still stored as a GIF.
    const saved = await save(GIF, "image/png");
    expect(saved.mime).toBe("image/gif");
  });

  it("rejects a non-image payload", async () => {
    await expect(
      saveUpload(Buffer.from("not an image at all"), "image/png", {
        allow: AVATAR_FORMATS,
      }),
    ).rejects.toThrow(/JPG, PNG, GIF/);
  });

  it("enforces the size cap", async () => {
    const big = Buffer.concat([JPEG, Buffer.alloc(2000)]);
    await expect(
      saveUpload(big, "image/jpeg", { allow: AVATAR_FORMATS, maxBytes: 1000 }),
    ).rejects.toThrow(/exceeds/);
  });
});
