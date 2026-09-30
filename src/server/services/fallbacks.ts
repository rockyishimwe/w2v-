/**
 * Deterministic AI fallbacks.
 *
 * When GROQ_API_KEY is missing (or the provider fails) the AI endpoints
 * still respond with sensible, locale-aware content so the product keeps
 * working on intermittent connections — matching the mock data the UI was
 * designed around.
 */
import type { Locale } from "../lib/http";

export interface FallbackScan {
  title: string;
  material: string;
  category: string;
  confidence: number;
  detectedSummary: string;
  condition: string;
  estimatedSize: string;
  tip: { title: string; body: string };
  recommendations: Array<{ category: string; description: string }>;
}

const SCAN_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    title: "Household waste item",
    summary: "1 item detected (approx. 500 ml)",
    tipTitle: "Good news!",
    tipBody:
      "This item looks reusable. Clean it and give it a second life before recycling.",
  },
  rw: {
    title: "Ikintu cy'ifumbire cyo mu rugo",
    summary: "1 ikintu cyabonetse (ingaragara 500 ml)",
    tipTitle: "Amakuru meza!",
    tipBody:
      "Iki gitekerezo gishobora gukoreshwa. Kirya cyawe ugihire akazi ka kabiri mbere yo kuvanga.",
  },
  fr: {
    title: "Objet ménager",
    summary: "1 objet détecté (environ 500 ml)",
    tipTitle: "Bonne nouvelle !",
    tipBody:
      "Cet objet semble réutilisable. Nettoyez-le et offrez-lui une seconde vie avant de le recycler.",
  },
};

const RECOMMENDATIONS: Array<{ category: string; description: string }> = [
  { category: "Reuse", description: "Use it for storage or decoration" },
  { category: "DIY", description: "Turn it into a planter or lamp" },
  { category: "Exchange", description: "Give or find someone who needs it" },
  {
    category: "Recycle",
    description: "If not reusable, recycle at a collection point",
  },
  { category: "Dispose safely", description: "Use proper waste bin if needed" },
];

/** Generic scan result used when no AI analysis is available. */
export function fallbackScan(locale: Locale): FallbackScan {
  const labels = SCAN_LABELS[locale];
  return {
    title: labels.title,
    material: "Mixed",
    category: "Container",
    confidence: 55,
    detectedSummary: labels.summary,
    condition: "Good",
    estimatedSize: "500 ml",
    tip: { title: labels.tipTitle, body: labels.tipBody },
    recommendations: RECOMMENDATIONS,
  };
}

const TIPS: Record<Locale, string[]> = {
  en: [
    "Rinse plastic bottles and drop them at a Kigali collection point.",
    "Compost food scraps — Kigali gardens thrive on home compost.",
    "Glass jars make great pantry storage; no purchase needed.",
  ],
  rw: [
    "Suka ibicu bya plastiki ubishyire ku ntara z'ibanze za Kigali.",
    "Koresha ifumbire mu rugo — birafasha imirima ya Kigali.",
    "Amasaho ya cerayini ni byiza byo kubika ibiribwa.",
  ],
  fr: [
    "Rincez les bouteilles en plastique et déposez-les dans un point de collecte à Kigali.",
    "Compostez les restes alimentaires — les jardins de Kigali adorent le compost maison.",
    "Les bocaux en verre sont parfaits pour le rangement.",
  ],
};

/** Short recycling tips per material/locale. */
export function fallbackTips(material: string, locale: Locale): string[] {
  const generic = TIPS[locale];
  const materialTip = generic[0].replace(generic[0].split(" ")[0], material);
  return [materialTip, ...generic.slice(1)];
}
