"use client";

import Link from "next/link";
import { CameraIcon, CheckIcon, LightbulbIcon } from "./icons";
import { useCapturedPhoto } from "@/hooks/use-captured-photo";

/**
 * "Photo captured" review step between the camera and the analysis result.
 * Retake goes back to the camera; "Use this photo" continues to the result
 * page where the (mock) analysis is displayed.
 */
export function CaptureResult() {
  const photo = useCapturedPhoto();

  return (
    <section className="mx-auto w-full max-w-[900px] rounded-[32px] border border-gray-100 bg-white p-5 shadow-[0_14px_30px_rgba(17,24,39,0.08)] sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dcf3e3] text-brand-700">
          <CheckIcon className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-[22px] font-semibold text-[#153a2a] sm:text-[25px]">
            Photo captured
          </h1>
          <p className="text-[13.5px] text-[#607493]">
            This is the image ready for waste analysis.
          </p>
        </div>
      </div>

      <div className="relative mt-7 aspect-[1.2] overflow-hidden rounded-[24px] bg-[#f2f7f3]">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="Captured waste item ready for analysis"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-[#607493]">
            <CameraIcon className="h-10 w-10 text-brand-700" />
            <p className="text-[14px]">
              No photo was captured in this session. Take a photo or upload an
              image to review it here.
            </p>
            <Link
              href="/scanner/take-photo"
              className="mt-2 flex h-11 items-center justify-center rounded-xl bg-brand-700 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-brand-800"
            >
              Take a photo
            </Link>
          </div>
        )}
      </div>

      <div className="mt-7 flex flex-wrap justify-end gap-3">
        <Link
          href="/scanner/take-photo"
          className="flex h-12 items-center justify-center rounded-xl border border-brand-500 px-6 text-[14px] font-semibold text-brand-700 transition-colors hover:bg-brand-50"
        >
          Retake photo
        </Link>
        <Link
          href="/scanner/result"
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-brand-800"
        >
          <LightbulbIcon className="h-5 w-5" />
          Use this photo
        </Link>
      </div>
    </section>
  );
}
