"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRightIcon,
  BellIcon,
  BoxIcon,
  BrainIcon,
  ChevronDownIcon,
  ExchangeIcon,
  FilterIcon,
  HeartIcon,
  InfinityIcon,
  LayersIcon,
  LeafIcon,
  MapIcon,
  MapPinIcon,
  PersonIcon,
  PlusIcon,
  RecycleIcon,
  SearchIcon,
  ShieldIcon,
  SparkleIcon,
  UsersIcon,
  ZapIcon,
} from "./icons";
import { AvatarArt } from "./dashboard-art";
import {
  CONDITION_FILTERS,
  FEATURED_LISTING,
  LISTINGS,
  MATERIAL_FILTERS,
  POPULAR_CATEGORIES,
  TYPE_FILTERS,
  type ConditionFilter,
  type ExchangeListing,
  type ListingTag,
  type MaterialFilter,
} from "@/constants/exchange";
import {
  CardboardStackArt,
  ClothesArt,
  FeaturedJarsArt,
  JarsPhotoArt,
  MetalPotsArt,
  PlasticContainersArt,
  SmartphonesArt,
  VegetablesArt,
  WoodenChairArt,
} from "./exchange-art";
import { filterListings, type TypeFilter } from "@/lib/exchange-filters";

const LISTING_ART: Record<
  string,
  (props: { className?: string }) => React.ReactNode
> = {
  "glass-jars": JarsPhotoArt,
  "cardboard-boxes": CardboardStackArt,
  "plastic-containers": PlasticContainersArt,
  "wooden-chair": WoodenChairArt,
  "organic-vegetables": VegetablesArt,
  "used-clothes": ClothesArt,
  "old-smartphones": SmartphonesArt,
  "metal-pots": MetalPotsArt,
};

const CATEGORY_ICONS: Record<
  string,
  { icon: (props: { className?: string }) => React.ReactNode; tone: string }
> = {
  Organic: { icon: LeafIcon, tone: "text-[#d9a13b]" },
  "Paper/Cardboard": { icon: BoxIcon, tone: "text-[#d9a13b]" },
  Plastic: { icon: RecycleIcon, tone: "text-[#4a7fb5]" },
  Glass: { icon: InfinityIcon, tone: "text-[#3f8f85]" },
  Metal: { icon: ShieldIcon, tone: "text-[#6f747b]" },
  Textile: { icon: ZapIcon, tone: "text-[#8a5fb5]" },
  Electronics: { icon: BrainIcon, tone: "text-[#4a5fb5]" },
};

const TAG_STYLES: Record<ListingTag, string> = {
  Free: "bg-brand-500 text-white",
  Exchange: "bg-brand-700 text-white",
  Sale: "bg-brand-900 text-white",
};

const chipBase =
  "flex h-[46px] items-center gap-2 rounded-2xl border px-4 text-[13.5px] font-semibold transition-colors";

export function ExchangeClient() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [materialFilter, setMaterialFilter] = useState<MaterialFilter | "All">(
    "All",
  );
  const [conditionFilter, setConditionFilter] = useState<
    ConditionFilter | "All"
  >("All");
  const [sortByDistance, setSortByDistance] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listingsRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState<null | "material" | "category">(
    null,
  );
  const materialMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  function showToast(message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function resetAndScroll() {
    listingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleMenu(menu: "material" | "category") {
    setOpenMenu((current) => (current === menu ? null : menu));
  }

  function closeMenu() {
    setOpenMenu(null);
  }

  // Close an open filter popover on outside pointerdown or Escape.
  useEffect(() => {
    if (!openMenu) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      const ref = openMenu === "material" ? materialMenuRef : categoryMenuRef;
      if (target && ref.current && !ref.current.contains(target)) {
        setOpenMenu(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  const listings = useMemo(
    () =>
      filterListings(LISTINGS, {
        query,
        typeFilter,
        materialFilter,
        conditionFilter,
        sortByDistance,
      }),
    [typeFilter, materialFilter, conditionFilter, query, sortByDistance],
  );

  const featuredVisible =
    (typeFilter === "All" || FEATURED_LISTING.tag === typeFilter) &&
    (materialFilter === "All" || FEATURED_LISTING.material === materialFilter);

  const filtersActive =
    typeFilter !== "All" ||
    materialFilter !== "All" ||
    conditionFilter !== "All" ||
    query.trim() !== "" ||
    sortByDistance;

  function clearFilters() {
    setTypeFilter("All");
    setMaterialFilter("All");
    setConditionFilter("All");
    setQuery("");
    setSortByDistance(false);
  }

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="font-display text-[30px] font-bold leading-none text-black">
            Exchange
          </h1>
          <p className="mt-2.5 text-[14px] text-[#607493]">
            Give, find, or exchange reusable materials in your community.
          </p>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 pt-1">
          <label className="relative hidden min-w-0 max-w-[520px] flex-1 sm:block">
            <span className="sr-only">Search listings</span>
            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              name="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search anything..."
              className="h-[52px] w-full rounded-full border border-gray-100 bg-white pl-12 pr-5 text-[14.5px] text-gray-900 shadow-[0_8px_20px_rgba(17,24,39,0.05)] placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </label>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 shadow-[0_8px_20px_rgba(17,24,39,0.05)] transition-colors hover:text-brand-700"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-500" />
          </button>

          <button
            type="button"
            aria-label="Account menu"
            className="flex shrink-0 items-center gap-1.5"
          >
            <AvatarArt className="h-11 w-11 rounded-full object-cover" />
            <ChevronDownIcon className="h-5 w-5 text-gray-900" />
          </button>
        </div>
      </header>

      {/* ── Content grid ────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(400px,1fr)]">
        {/* Left column */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Filter chips */}
          <div className="rounded-[24px] bg-white p-3.5 shadow-[0_10px_30px_rgba(17,24,39,0.045)]">
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setTypeFilter("All")}
                aria-pressed={typeFilter === "All"}
                className={`${chipBase} ${
                  typeFilter === "All"
                    ? "border-brand-700 bg-brand-700 text-white shadow-[0_8px_18px_rgba(20,92,54,0.28)]"
                    : "border-gray-100 bg-white text-gray-900 hover:border-brand-300"
                }`}
              >
                <LayersIcon className="h-4.5 w-4.5" />
                All
              </button>
              <FilterChip
                id="material-chip"
                panelId="material-filter-panel"
                icon={<PersonIcon className="h-4.5 w-4.5" />}
                label={
                  materialFilter === "All"
                    ? "Material"
                    : `Material · ${materialFilter}`
                }
                active={materialFilter !== "All"}
                open={openMenu === "material"}
                onClick={() => toggleMenu("material")}
                menuRef={materialMenuRef}
              >
                <MaterialMenu
                  value={materialFilter}
                  onSelect={(material) => {
                    setMaterialFilter(material);
                    closeMenu();
                    resetAndScroll();
                  }}
                />
              </FilterChip>
              <FilterChip
                id="category-chip"
                panelId="category-filter-panel"
                icon={<UsersIcon className="h-4.5 w-4.5" />}
                label="Category"
                active={materialFilter !== "All"}
                open={openMenu === "category"}
                onClick={() => toggleMenu("category")}
                menuRef={categoryMenuRef}
              >
                <CategoryMenu
                  onSelect={(label) => {
                    setMaterialFilter(
                      label === "Paper/Cardboard"
                        ? "Paper"
                        : (label as MaterialFilter),
                    );
                    closeMenu();
                    resetAndScroll();
                  }}
                />
              </FilterChip>
              <button
                type="button"
                onClick={() => setSortByDistance((v) => !v)}
                aria-pressed={sortByDistance}
                className={`${chipBase} ${
                  sortByDistance
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-gray-100 bg-white text-gray-900 hover:border-brand-300"
                }`}
              >
                <MapPinIcon className="h-4.5 w-4.5" />
                Distance
              </button>
              {TYPE_FILTERS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTypeFilter(tag)}
                  aria-pressed={typeFilter === tag}
                  className={`${chipBase} ${
                    typeFilter === tag
                      ? "border-brand-700 bg-brand-700 text-white"
                      : "border-gray-100 bg-white text-gray-900 hover:border-brand-300"
                  }`}
                >
                  {tag === "Free" ? (
                    <InfinityIcon className="h-4.5 w-4.5" />
                  ) : tag === "Exchange" ? (
                    <ExchangeIcon className="h-4.5 w-4.5" />
                  ) : (
                    <SparkleIcon className="h-4.5 w-4.5" />
                  )}
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Listings panel */}
          <section
            ref={listingsRef}
            className="scroll-mt-6 rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.045)] sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display flex items-center gap-2.5 text-[17px] font-bold text-gray-900">
                <MapPinIcon className="h-5 w-5 text-brand-700" />
                Nearby Listings
              </h2>
              <button
                type="button"
                onClick={() => showToast("Map view is coming soon.")}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 transition-colors hover:text-brand-500"
              >
                View map
                <MapIcon className="h-4.5 w-4.5" />
              </button>
            </div>

            {listings.length === 0 ? (
              <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-pale-green px-6 py-10 text-center">
                <SearchIcon className="h-8 w-8 text-brand-700" />
                <p className="text-[14px] font-semibold text-gray-900">
                  No listings match your filters.
                </p>
                <p className="text-[12.5px] text-gray-500">
                  Try a different material or listing type.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-1 flex h-10 items-center rounded-xl bg-brand-700 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-800"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    favorite={favorites.has(listing.id)}
                    onToggleFavorite={() => toggleFavorite(listing.id)}
                  />
                ))}
              </ul>
            )}

            {/* Popular categories + featured */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
              <PopularCategoriesCard
                onSelect={(label) => {
                  setMaterialFilter(
                    label === "Paper/Cardboard"
                      ? "Paper"
                      : (label as MaterialFilter),
                  );
                  resetAndScroll();
                }}
              />
              <FeaturedCard
                favorite={favorites.has(FEATURED_LISTING.id)}
                onToggleFavorite={() => toggleFavorite(FEATURED_LISTING.id)}
                onViewAll={() => {
                  clearFilters();
                  resetAndScroll();
                }}
                hidden={!featuredVisible && filtersActive ? true : false}
              />
            </div>
          </section>
        </div>

        {/* Right rail — solid sticky block (no internal scrolling) */}
        <div className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-7 xl:self-start">
          <PostMaterialCard
            onCreate={() =>
              showToast("Listing creation goes live with the community beta.")
            }
          />
          <QuickFiltersCard
            typeFilter={typeFilter}
            onType={setTypeFilter}
            material={materialFilter}
            onMaterial={setMaterialFilter}
            condition={conditionFilter}
            onCondition={setConditionFilter}
          />
          <ImpactNoteCard />
        </div>
      </div>

      {/* Chat FAB */}
      <button
        type="button"
        className="fixed bottom-24 right-4 z-10 flex h-[48px] items-center gap-3 rounded-full bg-brand-700 px-5 text-[14.5px] font-semibold text-white shadow-[0_8px_16px_rgba(20,92,54,0.2)] transition-colors hover:bg-brand-800 md:bottom-6 md:right-9"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v7A2.75 2.75 0 0 1 17.25 16.5H9l-4 3.5v-13.25Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        Chat
      </button>

      {/* Toast */}
      <div aria-live="polite">
        {toast && (
          <div className="fixed bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-gray-900 px-5 py-2.5 text-[13px] font-medium text-white shadow-lg md:bottom-8">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}

/* ── Listing card ─────────────────────────────────────────────── */

function ListingCard({
  listing,
  favorite,
  onToggleFavorite,
}: {
  listing: ExchangeListing;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  const Art = LISTING_ART[listing.id] ?? JarsPhotoArt;
  return (
    <li className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-[0_10px_24px_rgba(17,24,39,0.08)]">
      <div className="relative aspect-[1.12]">
        <Art className="absolute inset-0 h-full w-full" />
        <span
          className={`absolute bottom-2 left-2 rounded-md px-2 py-1 text-[10.5px] font-bold ${TAG_STYLES[listing.tag]}`}
        >
          {listing.tag}
        </span>
      </div>
      <div className="p-3">
        <p className="truncate text-[13.5px] font-bold text-gray-900">
          {listing.title}
        </p>
        <p className="mt-0.5 text-[11px] text-gray-500">{listing.meta}</p>
        <p className="mt-2 flex items-center gap-1 text-[11px] text-gray-500">
          <MapPinIcon className="h-3.5 w-3.5 text-brand-600" />
          {listing.distance} • {listing.district}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="flex min-w-0 items-center gap-1 text-[11px] text-gray-500">
            <PersonIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{listing.postedBy}</span>
          </p>
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={
              favorite
                ? `Remove ${listing.title} from favorites`
                : `Save ${listing.title} to favorites`
            }
            aria-pressed={favorite}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
              favorite
                ? "bg-brand-50 text-brand-700"
                : "text-gray-400 hover:text-brand-700"
            }`}
          >
            <HeartIcon
              className={`h-4 w-4 ${favorite ? "fill-brand-700" : ""}`}
            />
          </button>
        </div>
      </div>
    </li>
  );
}

/* ── Popular categories ───────────────────────────────────────── */

function PopularCategoriesCard({
  onSelect,
}: {
  onSelect: (label: string) => void;
}) {
  return (
    <section className="rounded-[24px] bg-pale-green p-4">
      <h3 className="font-display flex items-center gap-2 text-[14px] font-bold text-gray-900">
        <SparkleIcon className="h-4.5 w-4.5 text-brand-700" />
        Popular Categories
      </h3>
      <div className="mt-3 grid grid-cols-4 gap-2.5">
        {POPULAR_CATEGORIES.map(({ label }) => {
          const { icon: Icon, tone } =
            CATEGORY_ICONS[label] ?? CATEGORY_ICONS.Organic;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(label)}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-white px-1 py-3 transition-colors hover:bg-brand-50"
            >
              <Icon className={`h-5 w-5 ${tone}`} />
              <span className="text-center text-[10px] font-semibold leading-tight text-gray-700">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ── Featured listing ─────────────────────────────────────────── */

function FeaturedCard({
  favorite,
  onToggleFavorite,
  onViewAll,
  hidden,
}: {
  favorite: boolean;
  onToggleFavorite: () => void;
  onViewAll: () => void;
  hidden: boolean;
}) {
  if (hidden) return null;
  return (
    <section className="rounded-[24px] bg-pale-green p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display flex items-center gap-2 text-[14px] font-bold text-gray-900">
          <SparkleIcon className="h-4.5 w-4.5 text-brand-700" />
          Featured Listings
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-700 transition-colors hover:text-brand-500"
        >
          View all
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3.5 rounded-2xl bg-white p-3">
        <FeaturedJarsArt className="h-[86px] w-[86px] shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <span
            className={`inline-block rounded-md px-2 py-0.5 text-[10.5px] font-bold ${TAG_STYLES[FEATURED_LISTING.tag]}`}
          >
            {FEATURED_LISTING.tag}
          </span>
          <p className="mt-1 truncate text-[14px] font-bold text-gray-900">
            {FEATURED_LISTING.title}
          </p>
          <p className="text-[11.5px] text-gray-500">{FEATURED_LISTING.meta}</p>
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-gray-500">
            <MapPinIcon className="h-3.5 w-3.5 text-brand-600" />
            {FEATURED_LISTING.distance} • {FEATURED_LISTING.district}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="flex items-center gap-1 text-[11px] text-gray-500">
              <PersonIcon className="h-3.5 w-3.5" />
              {FEATURED_LISTING.postedBy}
            </p>
            <button
              type="button"
              onClick={onToggleFavorite}
              aria-label={
                favorite ? "Remove from favorites" : "Save to favorites"
              }
              aria-pressed={favorite}
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                favorite
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-400 hover:text-brand-700"
              }`}
            >
              <HeartIcon
                className={`h-4 w-4 ${favorite ? "fill-brand-700" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Post material ────────────────────────────────────────────── */

function PostMaterialCard({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="rounded-[24px] bg-pale-green p-5">
      <div className="flex items-start gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
          <PlusIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-[15.5px] font-bold text-gray-900">
            Post Material
          </h2>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-gray-600">
            Give away, exchange or sell your reusable items.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="mt-4 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl bg-brand-700 text-[14.5px] font-semibold text-white shadow-[0_10px_22px_rgba(20,92,54,0.28)] transition-colors hover:bg-brand-800"
      >
        <PlusIcon className="h-5 w-5" />
        Create Listing
      </button>
    </section>
  );
}

/* ── Quick filters ────────────────────────────────────────────── */

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-[38px] items-center rounded-full px-4 text-[12.5px] font-semibold transition-colors ${
        active
          ? "bg-brand-700 text-white shadow-[0_6px_14px_rgba(20,92,54,0.25)]"
          : "border border-gray-100 bg-white text-gray-700 hover:border-brand-300"
      }`}
    >
      {label}
    </button>
  );
}

function QuickFiltersCard({
  typeFilter,
  onType,
  material,
  onMaterial,
  condition,
  onCondition,
}: {
  typeFilter: TypeFilter;
  onType: (t: TypeFilter) => void;
  material: MaterialFilter | "All";
  onMaterial: (m: MaterialFilter | "All") => void;
  condition: ConditionFilter | "All";
  onCondition: (c: ConditionFilter | "All") => void;
}) {
  return (
    <section className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.045)]">
      <h2 className="font-display flex items-center gap-2.5 text-[16px] font-bold text-gray-900">
        <FilterIcon className="h-5 w-5 text-brand-700" />
        Quick Filters
      </h2>

      <p className="mt-4 text-[13px] font-bold text-gray-900">Material</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <FilterPill
          label="All"
          active={material === "All"}
          onClick={() => onMaterial("All")}
        />
        {MATERIAL_FILTERS.map((m) => (
          <FilterPill
            key={m}
            label={m}
            active={material === m}
            onClick={() => onMaterial(m)}
          />
        ))}
      </div>

      <p className="mt-4 text-[13px] font-bold text-gray-900">Condition</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <FilterPill
          label="All"
          active={condition === "All"}
          onClick={() => onCondition("All")}
        />
        {CONDITION_FILTERS.map((c) => (
          <FilterPill
            key={c}
            label={c}
            active={condition === c}
            onClick={() => onCondition(c)}
          />
        ))}
      </div>

      <p className="mt-4 text-[13px] font-bold text-gray-900">Listing Type</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <FilterPill
          label="All"
          active={typeFilter === "All"}
          onClick={() => onType("All")}
        />
        {TYPE_FILTERS.map((t) => (
          <FilterPill
            key={t}
            label={t}
            active={typeFilter === t}
            onClick={() => onType(t)}
          />
        ))}
      </div>
    </section>
  );
}

/* ── Impact note ──────────────────────────────────────────────── */

function ImpactNoteCard() {
  return (
    <section className="relative overflow-hidden rounded-[24px] bg-pale-green p-5">
      <LeafIcon className="pointer-events-none absolute -bottom-3 -right-1 h-12 w-12 rotate-[20deg] text-brand-200/50" />
      <div className="relative z-10 flex items-start gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
          <LeafIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 pr-8">
          <p className="font-display text-[14.5px] font-bold text-brand-900">
            Small actions. Big impact.
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-gray-600">
            Reusing and exchanging items keeps valuable materials in use and
            reduces waste.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Filter chip + popovers (Material / Category) ─────────────── */

function FilterChip({
  id,
  panelId,
  icon,
  label,
  active,
  open,
  onClick,
  menuRef,
  children,
}: {
  id: string;
  panelId: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  open: boolean;
  onClick: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onClick}
        className={`${chipBase} ${
          active || open
            ? "border-brand-700 bg-brand-700 text-white shadow-[0_8px_18px_rgba(20,92,54,0.28)]"
            : "border-gray-100 bg-white text-gray-900 hover:border-brand-300"
        }`}
      >
        {icon}
        {label}
      </button>
      {open && (
        <div
          id={panelId}
          role="menu"
          aria-labelledby={id}
          className="absolute left-0 top-[calc(100%+6px)] z-20 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_14px_30px_rgba(17,24,39,0.12)]"
        >
          {children}
        </div>
      )}
    </div>
  );
}

const MENU_ITEM_CLASS =
  "flex h-9 w-full items-center rounded-xl px-3 text-left text-[13px] font-semibold text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-700";

function MaterialMenu({
  value,
  onSelect,
}: {
  value: MaterialFilter | "All";
  onSelect: (material: MaterialFilter | "All") => void;
}) {
  return (
    <>
      <button
        type="button"
        role="menuitemradio"
        aria-checked={value === "All"}
        onClick={() => onSelect("All")}
        className={MENU_ITEM_CLASS}
      >
        All materials
      </button>
      {MATERIAL_FILTERS.map((m) => (
        <button
          key={m}
          type="button"
          role="menuitemradio"
          aria-checked={value === m}
          onClick={() => onSelect(m)}
          className={MENU_ITEM_CLASS}
        >
          {m}
        </button>
      ))}
    </>
  );
}

function CategoryMenu({ onSelect }: { onSelect: (label: string) => void }) {
  return (
    <>
      {POPULAR_CATEGORIES.map(({ label }) => (
        <button
          key={label}
          type="button"
          role="menuitem"
          onClick={() => onSelect(label)}
          className={MENU_ITEM_CLASS}
        >
          {label}
        </button>
      ))}
    </>
  );
}
