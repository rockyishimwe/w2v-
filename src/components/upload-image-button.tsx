"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { UploadIcon } from "./icons";
import { storeImageFile } from "@/lib/photo";

/**
 * Shared "Upload Image" control. Opens the file picker, downscales the
 * chosen image via lib/photo and hands off to the scanner result page —
 * the same pipeline the camera capture uses.
 */
export function UploadImageButton({ className }: { className: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      await storeImageFile(file);
      router.push("/scanner/result");
    } catch {
      setBusy(false);
    }
  }

  return (
    <label
      className={`${className} ${busy ? "cursor-wait opacity-70" : "cursor-pointer"}`}
    >
      <UploadIcon className="h-5 w-5" />
      {busy ? "Processing…" : "Upload Image"}
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </label>
  );
}
