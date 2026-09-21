"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CameraIcon, CheckIcon, LightbulbIcon } from "./icons";
import { PHOTO_KEY } from "./camera-viewfinder";

export function CaptureResult() {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPhoto(sessionStorage.getItem(PHOTO_KEY));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return <section className="mx-auto max-w-[900px] rounded-[36px] bg-white p-6 shadow-[0_14px_30px_rgba(17,24,39,0.08)] sm:p-8"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dcf3e3] text-brand-700"><CheckIcon className="h-6 w-6" /></span><div><h1 className="text-[25px] font-semibold text-[#153a2a]">Photo captured</h1><p className="text-[15px] text-[#607493]">This is the image ready for waste analysis.</p></div></div><div className="relative mt-7 aspect-[1.2] overflow-hidden rounded-[24px] bg-[#f2f7f3]">{photo ? <Image src={photo} alt="Captured waste item" fill unoptimized className="object-contain" /> : <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-[#607493]"><CameraIcon className="h-10 w-10 text-brand-700" /><p>No photo was captured in this session.</p></div>}</div><div className="mt-7 flex flex-wrap justify-end gap-3"><Link href="/scanner/take-photo" className="flex h-12 items-center justify-center rounded-xl border border-brand-500 px-6 text-[15px] font-semibold text-brand-700">Retake photo</Link><Link href="/scanner" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 text-[15px] font-semibold text-white"><LightbulbIcon className="h-5 w-5" />Use this photo</Link></div></section>;
}
