"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  BotIcon,
  BoxIcon,
  ChatSolidIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClipboardIcon,
  ClockIcon,
  ExchangeIcon,
  ExpandIcon,
  HeartIcon,
  InfinityIcon,
  LightbulbIcon,
  LeafIcon,
  MapIcon,
  MapPinIcon,
  PlantIcon,
  PowerIcon,
  RecycleIcon,
  SearchIcon,
  ShareIcon,
  ShieldIcon,
  SparkleIcon,
  StarIcon,
  TagIcon,
  UsersIcon,
} from "./icons";
import { AvatarArt } from "./dashboard-art";
import { Avatar } from "./avatar";
import {
  expressInterest,
  fetchListingDetail,
  type ExchangeItemDetail,
  type ListingTag,
} from "@/services/exchange-service";
import { hasSession } from "@/services/auth-service";
import { ItemArt, MapArt } from "./exchange-art";

/** Listing-type chip icons, matching the exchange page's type filters. */
const TAG_ICONS: Record<
  ListingTag,
  (props: { className?: string }) => React.ReactNode
> = {
  Free: InfinityIcon,
  Exchange: ExchangeIcon,
  Sale: SparkleIcon,
};

/** Photo badge text per listing type. */
const AVAILABILITY_LABELS: Record<ListingTag, string> = {
  Free: "Free to collect",
  Exchange: "Available for exchange",
  Sale: "Available for sale",
};

const DETAIL_ROW_ICONS: Record<
  string,
  (props: { className?: string }) => React.ReactNode
> = {
  Type: ExchangeIcon,
  Condition: TagIcon,
  Availability: PowerIcon,
  "Pickup Location": MapPinIcon,
  "Preferred Exchange": PlantIcon,
  Posted: ClockIcon,
};

const CARD_SHADOW = "shadow-[0_10px_30px_rgba(17,24,39,0.045)]";

export function ExchangeDetailClient({ listingId }: { listingId: string }) {
  const [detail, setDetail] = useState<ExchangeItemDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected] = useState(0);
  const [savedAreaItems, setSavedAreaItems] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // Fetch the real listing detail from the API.
  useEffect(() => {
    let cancelled = false;
    fetchListingDetail(listingId)
      .then((payload) => {
        if (!cancelled) setDetail(payload);
      })
      .catch(() => {
        if (!cancelled) setError("This listing is unavailable.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  /** Real "message the poster" flow: POST interest, then confirm. */
  function handleMessageSeller() {
    if (!hasSession()) {
      showToast("Please log in to contact the poster.");
      return;
    }
    expressInterest(listingId)
      .then(() => showToast("Interest sent! The poster will reach out."))
      .catch(() => showToast("Couldn't send your message. Try again."));
  }

  function toggleSaved(id: string) {
    setSavedAreaItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  if (loading) {
    return (
      <div className="grid gap-5">
        <div className="h-[380px] animate-pulse rounded-[24px] bg-white" />
        <div className="h-[280px] animate-pulse rounded-[24px] bg-white" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[24px] bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(17,24,39,0.045)]">
        <SearchIcon className="h-8 w-8 text-brand-700" />
        <p className="text-[15px] font-semibold text-gray-900">
          {error ?? "Listing not found."}
        </p>
        <Link
          href="/exchange"
          className="flex h-11 items-center rounded-xl bg-brand-700 px-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-800"
        >
          Back to listings
        </Link>
      </div>
    );
  }

  const gallery = detail.image ? [detail.image] : [];

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <div className="flex items-center gap-4">
            <Link
              href="/exchange"
              aria-label="Back to exchange listings"
              className="text-gray-900 transition-colors hover:text-brand-700"
            >
              <ArrowLeftIcon className="h-8 w-8" />
            </Link>
            <h1 className="font-display text-[32px] font-bold leading-none text-black">
              Exchange
            </h1>
          </div>
          <p className="mt-2.5 text-[14px] text-[#607493]">
            Give, find, or exchange reusable materials in your community.
          </p>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-4 pt-1 sm:flex-nowrap">
          <label className="relative order-last block w-full min-w-0 sm:order-none sm:w-auto sm:max-w-[584px] sm:flex-1">
            <span className="sr-only">Search</span>
            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              name="search"
              placeholder="Search anything..."
              className="h-[52px] w-full rounded-full border border-gray-100 bg-white pl-12 pr-5 text-[14.5px] text-gray-900 shadow-[0_8px_20px_rgba(17,24,39,0.05)] placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </label>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 shadow-[0_8px_20px_rgba(17,24,39,0.05)] transition-colors hover:text-brand-700"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-500" />
          </button>

          <button
            type="button"
            aria-label="Account menu"
            className="flex shrink-0 items-center gap-1.5"
          >
            <Avatar className="h-11 w-11 rounded-full object-cover" />
            <ChevronDownIcon className="h-5 w-5 text-gray-900" />
          </button>
        </div>
      </header>

      {/* ── Content grid ────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.72fr)_minmax(390px,1fr)]">
        {/* Left column */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Item overview */}
          <section
            className={`rounded-[24px] bg-white p-5 ${CARD_SHADOW} sm:p-6`}
          >
            <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
              {/* Photo */}
              <div className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-2xl bg-[#f2f7f3]">
                {gallery.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={gallery[selected] ?? gallery[0]}
                    alt={detail.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <ItemArt
                    artKey={detail.id}
                    className="absolute inset-0 h-full w-full"
                  />
                )}
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-gray-900 shadow-sm">
                  <UsersIcon className="h-3.5 w-3.5" />
                  {AVAILABILITY_LABELS[detail.tag]}
                </span>
              </div>

              {/* Identification + attributes */}
              <div className="flex min-w-0 flex-col items-start">
                <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-[12px] font-semibold text-gray-900">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-700 text-white">
                    <CheckIcon className="h-2.5 w-2.5" />
                  </span>
                  {detail.badge}
                </span>

                <h2 className="font-display mt-2.5 text-[26px] font-bold leading-tight text-gray-900 sm:text-[28px]">
                  {detail.title}
                </h2>

                <p className="mt-2 text-[12.5px] text-gray-500">
                  {detail.statusNotes.join(" • ")}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
                  {detail.attributes.map((attribute, index) => {
                    const AttributeIcon =
                      index === 0
                        ? ClipboardIcon
                        : index === 1
                          ? ShieldIcon
                          : ExpandIcon;
                    return (
                      <div
                        key={attribute.label}
                        className="flex items-center gap-2.5"
                      >
                        <AttributeIcon className="h-4.5 w-4.5 shrink-0 text-gray-800" />
                        <div>
                          <p className="text-[11.5px] leading-tight text-gray-500">
                            {attribute.label}
                          </p>
                          <p className="mt-0.5 text-[13.5px] font-bold leading-tight text-gray-900">
                            {attribute.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 w-full border-t border-gray-100 pt-4">
                  {detail.description.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[13px] leading-relaxed text-gray-600"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <span className="mt-4 flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2.5 text-[12.5px] font-semibold text-gray-900">
                  <LeafIcon className="h-4 w-4 text-brand-700" />
                  {detail.ecoNote}
                  <RecycleIcon className="h-4 w-4 text-gray-500" />
                </span>
              </div>
            </div>
          </section>

          {/* Exchange details */}
          <section
            className={`rounded-[24px] bg-white p-5 ${CARD_SHADOW} sm:p-6`}
          >
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pale-green text-brand-700">
                <ExchangeIcon className="h-5 w-5" />
              </span>
              <h2 className="font-display text-[19px] font-bold text-gray-900">
                Exchange Details
              </h2>
            </div>

            <ul className="mt-6 space-y-[22px]">
              {detail.details.map((row) => {
                const RowIcon = DETAIL_ROW_ICONS[row.label] ?? TagIcon;
                return (
                  <li key={row.label} className="flex items-center gap-4">
                    <RowIcon className="h-[18px] w-[18px] shrink-0 text-gray-700" />
                    <p className="w-[150px] shrink-0 text-[14.5px] font-semibold text-gray-900 sm:w-[190px]">
                      {row.label}
                    </p>
                    <p className="min-w-0 flex-1 text-[14.5px] text-gray-700">
                      {row.value}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* More items from this area (hidden when the district has none) */}
          {detail.areaItems.length > 0 && (
            <section
              className={`rounded-[24px] bg-white p-5 ${CARD_SHADOW} sm:p-6`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display flex items-center gap-3 text-[18px] font-bold text-gray-900">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <BoxIcon className="h-5 w-5" />
                  </span>
                  More Exchange Items from this Area
                </h2>
                <Link
                  href="/exchange"
                  className="flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-700 transition-colors hover:text-brand-500"
                >
                  View all
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>

              <ul className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {detail.areaItems.map((item) => {
                  const TagChipIcon = TAG_ICONS[item.tag];
                  const saved = savedAreaItems.has(item.id);
                  return (
                    <li
                      key={item.id}
                      className="relative rounded-2xl border border-gray-100 bg-white p-2 transition-shadow hover:shadow-[0_10px_24px_rgba(17,24,39,0.08)]"
                    >
                      <Link
                        href={`/exchange/${item.id}`}
                        className="absolute inset-0 z-10 rounded-2xl"
                        aria-label={`View ${item.title}`}
                      />
                      <div className="relative aspect-[1.05] overflow-hidden rounded-xl">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <ItemArt
                            artKey={item.id}
                            className="absolute inset-0 h-full w-full"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSaved(item.id)}
                        aria-label={
                          saved
                            ? `Remove ${item.title} from favorites`
                            : `Save ${item.title} to favorites`
                        }
                        aria-pressed={saved}
                        className="absolute right-3.5 top-3.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm transition-colors hover:text-brand-700"
                      >
                        <HeartIcon
                          className={`h-3.5 w-3.5 text-gray-500 ${
                            saved ? "fill-brand-700 text-brand-700" : ""
                          }`}
                        />
                      </button>
                      <div className="px-1.5 pb-1.5 pt-2.5">
                        <p className="truncate text-[13.5px] font-bold text-gray-900">
                          {item.title}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-[10.5px] font-semibold text-brand-700">
                          <TagChipIcon className="h-3 w-3" />
                          {item.tag}
                        </span>
                        <p className="mt-2 flex items-center gap-1 text-[11px] text-gray-500">
                          <MapPinIcon className="h-3.5 w-3.5 text-brand-600" />
                          <span className="truncate">{item.location}</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        {/* Right rail */}
        <div className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-7 xl:self-start">
          {/* Poster card — real stats only */}
          <section className={`rounded-[24px] bg-white p-6 ${CARD_SHADOW}`}>
            <div className="flex items-center gap-4">
              <AvatarArt className="h-[72px] w-[72px] shrink-0 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="text-[13px] text-gray-500">Posted by</p>
                <p className="mt-0.5 text-[19px] font-bold leading-tight text-gray-900">
                  <span className="truncate">{detail.poster.name}</span>
                </p>
                <p className="mt-0.5 text-[13px] text-gray-500">
                  Member since {detail.poster.memberSince}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <p className="flex items-center gap-2 text-[14.5px]">
                <StarIcon className="h-5 w-5 text-gray-800" />
                <span className="font-bold text-gray-900">
                  {detail.poster.exchanges}
                </span>
                <span className="text-gray-500">
                  {detail.poster.exchanges === 1 ? "exchange" : "exchanges"}{" "}
                  made
                </span>
              </p>
              <p className="mt-2 flex items-center gap-2 text-[14.5px]">
                <BoxIcon className="h-5 w-5 text-gray-800" />
                <span className="font-bold text-gray-900">
                  {detail.poster.activeListings}
                </span>
                <span className="text-gray-500">
                  active{" "}
                  {detail.poster.activeListings === 1 ? "listing" : "listings"}
                </span>
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <p className="flex min-w-0 items-center gap-2 text-[14.5px] font-bold text-gray-900">
                <MapPinIcon className="h-5 w-5 shrink-0" />
                <span className="truncate">{detail.poster.location}</span>
              </p>
              <p className="flex shrink-0 items-center gap-1 text-[13px] text-gray-500">
                <MapPinIcon className="h-3.5 w-3.5" />
                {detail.poster.distanceAway}
              </p>
            </div>

            <button
              type="button"
              onClick={handleMessageSeller}
              className="mt-5 flex h-[52px] mx-auto w-[min(240px,100%)] items-center justify-center gap-2.5 rounded-2xl bg-brand-700 text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(20,92,54,0.28)] transition-colors hover:bg-brand-800"
            >
              <ChatSolidIcon className="h-5 w-5" />
              Message Poster
            </button>
          </section>

          {/* Pickup location */}
          <section className={`rounded-[24px] bg-white p-6 ${CARD_SHADOW}`}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pale-green text-brand-700">
                <MapPinIcon className="h-5 w-5" />
              </span>
              <h2 className="font-display text-[17px] font-bold text-gray-900">
                Pickup Location
              </h2>
            </div>

            <div className="relative mt-4 h-[150px] overflow-hidden rounded-2xl">
              <MapArt className="absolute inset-0 h-full w-full" />
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-2xl bg-white px-3 py-2 shadow-[0_10px_24px_rgba(17,24,39,0.14)]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-900 text-white">
                  <MapPinIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-bold text-gray-900">
                    {detail.pickupPoint}
                  </span>
                  <span className="block text-[11px] text-gray-500">
                    {detail.pickupNote}
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => showToast("Map view is coming soon.")}
                className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[13px] font-semibold text-gray-900 shadow-[0_8px_18px_rgba(17,24,39,0.12)] transition-colors hover:text-brand-700"
              >
                <MapIcon className="h-4 w-4" />
                View on Map
              </button>
            </div>
          </section>

          {/* Why exchange */}
          <section className="rounded-[24px] bg-pale-green p-5">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
                <LightbulbIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[14.5px] font-bold text-brand-900">
                  Why exchange?
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-gray-600">
                  {detail.whyExchange}
                </p>
              </div>
            </div>
          </section>

          {/* Share */}
          <button
            type="button"
            onClick={() => showToast("Share options are coming soon.")}
            className="group flex items-center gap-3.5 rounded-[24px] bg-pale-green p-5 text-left transition-colors hover:bg-brand-100"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
              <ShareIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-display block text-[14.5px] font-bold text-brand-900">
                Share this item
              </span>
              <span className="mt-0.5 block text-[12.5px] text-gray-600">
                {detail.shareNote}
              </span>
            </span>
            <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-700 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Chat FAB */}
      <Link
        href="/assistant"
        className="fixed bottom-24 right-4 z-10 flex h-[48px] items-center gap-3 rounded-full bg-brand-700 px-3 text-[14.5px] font-semibold text-white shadow-[0_8px_16px_rgba(20,92,54,0.2)] transition-colors hover:bg-brand-800 md:bottom-6 md:right-9"
      >
        <BotIcon className="h-6 w-6" />
        Chat
      </Link>

      {/* Toast */}
      <div aria-live="polite">
        {toast && (
          <div className="fixed bottom-40 left-1/2 z-30 -translate-x-1/2 rounded-full bg-gray-900 px-5 py-2.5 text-[13px] font-medium text-white shadow-lg md:bottom-8">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
