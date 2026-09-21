"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CameraIcon, LightbulbIcon } from "./icons";
import { storeVideoFrame } from "@/lib/photo";

export function CameraViewfinder() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(true);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch {
        setCameraError(true);
      }
    }

    void startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function capturePhoto() {
    const video = videoRef.current;
    if (!video || !cameraReady) return;

    const captured = storeVideoFrame(video);
    if (!captured) return;

    streamRef.current?.getTracks().forEach((track) => track.stop());
    router.push("/scanner/review");
  }

  return (
    <section className="rounded-[42px] bg-white p-8 shadow-[0_14px_30px_rgba(17,24,39,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display flex items-center gap-6 text-[21px] font-semibold text-[#132f42]">
          <span aria-hidden="true" className="text-3xl leading-none">←</span>
          Take Photo
        </h2>
        <span className="flex items-center gap-2 rounded-full border border-[#c9e9d1] bg-[#effaf1] px-5 py-2 text-[14.5px] font-semibold text-brand-700">
          <CameraIcon className="h-5 w-5" />
          Camera
        </span>
      </div>

      <div className="relative mt-6 aspect-[1.09] overflow-hidden rounded-md bg-[#c9ad85]">
        {cameraReady ? (
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
        ) : (
          <Image src="/images/scanner-jars-preview.png" alt="Two empty glass jars ready to scan" fill priority className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/5" />
        <FrameCorner className="left-6 top-6 rounded-tl-[24px] border-l-4 border-t-4" />
        <FrameCorner className="right-6 top-6 rounded-tr-[24px] border-r-4 border-t-4" />
        <FrameCorner className="bottom-6 left-6 rounded-bl-[24px] border-b-4 border-l-4" />
        <FrameCorner className="bottom-6 right-6 rounded-br-[24px] border-b-4 border-r-4" />
        <button
          type="button"
          aria-label="Capture photo"
          onClick={capturePhoto}
          disabled={!cameraReady}
          className="absolute bottom-4 left-1/2 h-[90px] w-[90px] -translate-x-1/2 rounded-full border-[5px] border-brand-700 bg-[#cf8654] p-[6px] disabled:cursor-not-allowed disabled:opacity-75"
        >
          <span className="block h-full w-full rounded-full bg-white" />
        </button>
        {cameraError && (
          <p className="absolute inset-x-4 top-4 rounded-xl bg-black/55 px-4 py-2 text-center text-sm text-white">
            Camera access is unavailable. Allow camera access and refresh to capture a photo.
          </p>
        )}
      </div>

      <section className="mt-7 flex items-center gap-5 rounded-[25px] border border-[#c9ead0] bg-[#effaf1] px-7 py-4">
        <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#dcf3e3] text-brand-700"><LightbulbIcon className="h-7 w-7" /></span>
        <div><h3 className="font-display text-[16px] font-semibold text-brand-700">Tip</h3><p className="mt-1 text-[14.5px] leading-snug text-[#56766a]">Make sure the item is well lit and clearly<br className="hidden sm:block" /> visible.</p></div>
      </section>
    </section>
  );
}

function FrameCorner({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute h-14 w-14 border-white ${className}`} />;
}
