/**
 * Low-bandwidth helpers for handling captured photos.
 * Kigali MVP constraint (README/SRS): tolerate intermittent connectivity —
 * so all photo state stays client-side and aggressively downscaled.
 */

/** sessionStorage key the camera/upload flow uses to hand off the capture. */
export const PHOTO_KEY = "w2v-scanner-capture";

/** Maximum stored width in px — keeps the dataURL small for slow networks. */
const MAX_CAPTURE_WIDTH = 1200;

/** JPEG quality used when encoding captures. */
const JPEG_QUALITY = 0.86;

/**
 * Hard ceiling for an encoded dataURL, matching the server's cap
 * (`dataUrlImage` in src/server/schemas). Re-encoding steps down through
 * these qualities until the result fits, so a detailed photo from a modern
 * phone camera is shrunk rather than rejected.
 */
const MAX_DATA_URL_CHARS = 1_350_000;
const FALLBACK_QUALITIES = [0.7, 0.55, 0.4];

function downscaleToDataUrl(
  source: HTMLVideoElement | HTMLImageElement,
  sourceWidth: number,
  sourceHeight: number,
): string {
  const scale = Math.min(1, MAX_CAPTURE_WIDTH / sourceWidth);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(sourceWidth * scale);
  canvas.height = Math.round(sourceHeight * scale);
  canvas.getContext("2d")?.drawImage(source, 0, 0, canvas.width, canvas.height);

  let dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  for (const quality of FALLBACK_QUALITIES) {
    if (dataUrl.length <= MAX_DATA_URL_CHARS) break;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }
  return dataUrl;
}

/** Decodes a user-selected file into an <img>, or rejects if unreadable. */
function decodeImageFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the selected image."));
    };
    image.src = url;
  });
}

/**
 * Reads a user-selected image and returns it as a downscaled JPEG dataURL
 * without touching sessionStorage — for flows that pass the photo straight
 * to the API (the assistant composer) rather than handing it to another
 * screen. Throws when the file is not a decodable image or is still too
 * large after re-encoding.
 */
export async function readImageFile(file: File): Promise<string> {
  if (file.type && !file.type.startsWith("image/")) {
    throw new Error("Only image files can be attached.");
  }

  const image = await decodeImageFile(file);
  const dataUrl = downscaleToDataUrl(
    image,
    image.naturalWidth,
    image.naturalHeight,
  );

  if (dataUrl.length > MAX_DATA_URL_CHARS) {
    throw new Error("That image is too large. Try a smaller photo.");
  }
  return dataUrl;
}

/**
 * Grabs the current video frame, downscales and stores it as a JPEG dataURL.
 * Returns null when the video is not ready; throws if storage fails.
 */
export function storeVideoFrame(video: HTMLVideoElement): string | null {
  if (!video.videoWidth) return null;
  const dataUrl = downscaleToDataUrl(
    video,
    video.videoWidth,
    video.videoHeight,
  );
  sessionStorage.setItem(PHOTO_KEY, dataUrl);
  return dataUrl;
}

/**
 * Reads a user-selected image file, downscales it (EXIF orientation is
 * applied by browsers at decode time) and stores it as a JPEG dataURL.
 */
export async function storeImageFile(file: File): Promise<string> {
  const image = await decodeImageFile(file);
  const dataUrl = downscaleToDataUrl(
    image,
    image.naturalWidth,
    image.naturalHeight,
  );
  // Storage can throw (quota exceeded); let it reject rather than hang.
  sessionStorage.setItem(PHOTO_KEY, dataUrl);
  return dataUrl;
}

/** Loads the session capture, or null when nothing was captured yet. */
export function loadPhoto(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PHOTO_KEY);
}
