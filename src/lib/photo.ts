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
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

/**
 * Grabs the current video frame, downscales and stores it as a JPEG dataURL.
 * Returns null when the video is not ready.
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
export function storeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      const dataUrl = downscaleToDataUrl(
        image,
        image.naturalWidth,
        image.naturalHeight,
      );
      sessionStorage.setItem(PHOTO_KEY, dataUrl);
      resolve(dataUrl);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the selected image."));
    };
    image.src = url;
  });
}

/** Loads the session capture, or null when nothing was captured yet. */
export function loadPhoto(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PHOTO_KEY);
}
