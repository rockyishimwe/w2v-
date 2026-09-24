"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { UploadIcon } from "./icons";
import { storeImageFile } from "@/lib/photo";

/**
 * Shared "Upload Image" control. Opens the file picker, downscales the
 * chosen image via lib/photo and hands off to the review step — the same
 * pipeline the camera capture uses.
 */
export function UploadImageButton({ className }: { className: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setFailed(false);
    try {
      await storeImageFile(file);
      router.push("/scanner/review");
    } catch {
      setBusy(false);
      setFailed(true);
    }
  }

  return (
    <label
      className={`${className} ${busy ? "cursor-wait opacity-70" : "cursor-pointer"}`}
    >
      <UploadIcon className="h-5 w-5" />
      {busy
        ? "Processing…"
        : failed
          ? "Upload failed — try again"
          : "Upload Image"}
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
