"use client";

import { useEffect, useState } from "react";
import { getMockScanResult } from "@/services/scanner-service";
import type { ScanResult } from "@/types";
import {
  ArrowDownCircleIcon,
  BoxIcon,
  CheckIcon,
  ChevronUpIcon,
  DatabaseIcon,
  GaugeIcon,
  NodesIcon,
  ShieldIcon,
  SparkleIcon,
  TrashIcon,
} from "./icons";
import { GlassJarsPhotoArt, LeafWatermarkArt } from "./scanner-art";
import { loadPhoto } from "@/lib/photo";


/**
 * Mock analysis via the service layer — the UI is already shaped for the
 * real ScanResult API payload (see types/index.ts).
 */
const RESULT: ScanResult = getMockScanResult();

/** View-model: pairs ScanResult fields with the icons that render them. */
const DETAILS = [
  { icon: DatabaseIcon, label: "Material", value: RESULT.material },
  { icon: ShieldIcon, label: "Condition", value: RESULT.condition },
  { icon: BoxIcon, label: "Category", value: RESULT.category },
  { icon: TrashIcon, label: "Detected items", value: RESULT.detectedSummary },
  { icon: GaugeIcon, label: "Estimated size", value: RESULT.estimatedSize },
];

function MetaBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: (props: { className?: string }) => React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-5 w-5 shrink-0 text-gray-800" />
      <div>
        <p className="text-[12px] leading-tight text-gray-500">{label}</p>
        <p className="mt-0.5 text-[13.5px] font-semibold leading-tight text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function ConfidenceRing({ percent }: { percent: number }) {
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 40 40" className="h-10 w-10 -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="#e4ede6"
          strokeWidth="5"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="#145c36"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
        />
      </svg>
      <p className="mt-1.5 text-[11.5px] leading-tight text-gray-500">
        Confidence
      </p>
      <p className="text-[13.5px] font-bold leading-tight text-brand-700">
        {percent}%
      </p>
    </div>
  );
}

export function ScannerResultCard() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(true);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPhoto(loadPhoto());
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="rounded-[32px] border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)] sm:p-8">
      {/* Photo + identification */}
      <div className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,328px)_minmax(0,1fr)]">
        <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[#f2f7f3]">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt="Captured waste item"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <GlassJarsPhotoArt className="absolute inset-0 h-full w-full" />
          )}
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11.5px] font-semibold text-gray-900 shadow-sm">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-700 text-white">
              <CheckIcon className="h-2.5 w-2.5" />
            </span>
            Image analyzed
          </span>
        </div>

        <div className="flex flex-col items-start py-1">
          <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-2 text-[12px] font-semibold text-gray-900">
            <SparkleIcon className="h-4 w-4 text-brand-700" />
            AI Identified
          </span>

          <h2 className="font-display mt-3 text-[26px] font-bold leading-tight text-gray-900 sm:text-[30px]">
            {RESULT.title}
          </h2>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 sm:gap-x-8">
            <MetaBlock
              icon={DatabaseIcon}
              label="Material"
              value={RESULT.material}
            />
            <div className="hidden h-10 w-px bg-gray-200 sm:block" />
            <MetaBlock
              icon={BoxIcon}
              label="Category"
              value={RESULT.category}
            />
            <div className="hidden h-10 w-px bg-gray-200 sm:block" />
            <ConfidenceRing percent={RESULT.confidence} />
          </div>
        </div>
      </div>

      {/* Detected items */}
      <div className="mt-8 border-t border-gray-100 pt-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <NodesIcon className="h-6 w-6" />
          </span>
          <div>
            <p className="font-display text-[15px] font-bold text-gray-900">
              Detected items
            </p>
            <p className="mt-0.5 text-[13.5px] text-gray-600">
              {RESULT.detectedSummary}
            </p>
          </div>
        </div>
      </div>

      {/* More details */}
      <div className="relative mt-6 overflow-hidden rounded-[24px] bg-pale-green">
        <button
          type="button"
          onClick={() => setDetailsOpen((open) => !open)}
          aria-expanded={detailsOpen}
          aria-controls="scan-details"
          className="flex w-full items-center justify-between gap-3 px-6 pt-6 text-left sm:px-7"
        >
          <span className="font-display text-[15px] font-bold text-brand-900">
            More details
          </span>
          <ChevronUpIcon
            className={`h-5 w-5 text-gray-800 transition-transform duration-200 ${
              detailsOpen ? "" : "rotate-180"
            }`}
          />
        </button>

        {detailsOpen && (
          <div
            id="scan-details"
            className="grid gap-x-10 gap-y-5 px-6 pb-7 pt-5 sm:grid-cols-2 sm:px-7"
          >
            {DETAILS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3.5">
                <Icon className="h-5 w-5 shrink-0 text-gray-800" />
                <div>
                  <p className="text-[12px] leading-tight text-gray-500">
                    {label}
                  </p>
                  <p className="mt-0.5 text-[13.5px] font-semibold leading-tight text-gray-900">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <LeafWatermarkArt className="pointer-events-none absolute -bottom-3 right-2 h-28 w-28 text-brand-200/50" />
      </div>

      {/* Tip banner */}
      <div className="relative mt-5 overflow-hidden rounded-[24px] bg-pale-green">
        <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white shadow-sm">
            <ArrowDownCircleIcon className="h-6 w-6" />
          </span>
          <div>
            <p className="font-display text-[14.5px] font-bold text-gray-900">
              {RESULT.tip.title}
            </p>
            <p className="mt-0.5 text-[13.5px] text-gray-600">
              {RESULT.tip.body}
            </p>
          </div>
        </div>
        <LeafWatermarkArt className="pointer-events-none absolute -bottom-3 right-2 h-24 w-24 text-brand-200/50" />
      </div>
    </section>
  );
}
