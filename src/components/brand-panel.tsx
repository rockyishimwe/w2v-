import Image from "next/image";

export function BrandPanel() {
  return (
    <aside
      className="relative hidden min-h-screen w-full overflow-hidden bg-forest-950 lg:flex lg:w-[46%] xl:w-[47%]"
      aria-label="Waste2Value"
    >
      {/* Full-bleed artwork: leaves, diagonal white wedge, green stripes */}
      <Image
        src="/images/side-bg.png"
        alt=""
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 47vw"
        className="object-cover object-left"
      />

      {/*
        Brand content, anchored top-left inside the artwork's dark region.
        The white wedge slopes from ~81% width (top) to ~59% (at 60% height),
        so the block is left-anchored and width-capped to stay clear of it;
        glyphs sit centered within the block but never reach its right edge.
      */}
      <div className="relative z-10 flex h-full w-full flex-col items-start justify-start pl-[7%] pr-[4%] pt-[8vh]">
        <div className="flex w-[min(88%,420px)] flex-col items-center text-center">
          <Image
            src="/images/logo-small.png"
            alt="Waste2Value logo"
            width={280}
            height={187}
            priority
            className="h-auto w-[clamp(160px,22vh,260px)] max-w-full drop-shadow-[0_18px_28px_rgba(0,0,0,0.6)]"
          />

          <p className="mt-[clamp(1rem,3.5vh,2.25rem)] text-[clamp(1.6rem,4.2vh,2.25rem)] font-medium text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]">
            Waste<span className="text-leaf-400">2Value</span>
          </p>

          <p className="mt-[clamp(0.5rem,1.8vh,1.1rem)] text-[clamp(1.1rem,2.8vh,1.5rem)] font-light text-mist-100 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
            Less waste. More value.
          </p>

          <p className="mt-[clamp(0.7rem,2.2vh,1.4rem)] text-[clamp(0.95rem,2.2vh,1.125rem)] leading-relaxed text-leaf-200 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
            Discover. Reuse. Recycle.
            <br />
            Build a sustainable tomorrow.
          </p>
        </div>
      </div>
    </aside>
  );
}
