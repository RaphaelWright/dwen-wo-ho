"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProviderLaunch2Nav } from "@/_unused/components/marketing/join-as-provider-2/provider-launch-2-nav";
import { ProviderLaunch2ShowcaseCard } from "@/_unused/components/marketing/join-as-provider-2/showcase-card";
import { useProviderLaunch2Sequence } from "@/hooks/components/marketing/provider-launch-2";
import {
  PROVIDER_LAUNCH_2_CONTENT,
  PROVIDER_LAUNCH_2_ROLES,
  PROVIDER_LAUNCH_2_SHOWCASE_CARDS,
} from "@/_unused/lib/marketing/for-providers-2";

export function ProviderLaunch2() {
  const router = useRouter();
  const { hero, links, assets } = PROVIDER_LAUNCH_2_CONTENT;

  useProviderLaunch2Sequence();

  return (
    <div
      className="provider-launch-2-shell bg-footer-bg fixed inset-0 overflow-hidden overscroll-none text-[#f4eef7] antialiased"
      id="providerLaunch2Shell"
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-y-auto bg-[url('/Provider-bg.jpg')] bg-cover bg-fixed bg-center lg:h-screen lg:overflow-hidden"
        id="backdrop"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-black/50"
        aria-hidden="true"
      />
      <ProviderLaunch2Nav />
      <div className="fixed inset-0 z-1 flex h-full items-start justify-center overflow-hidden">
        <div
          className="flex min-h-full w-full max-w-[1480px] origin-top flex-col px-7 pt-20 pb-10 will-change-transform max-[480px]:p-4 max-[480px]:pt-16"
          id="scaleRoot"
        >
          <header
            className="pl2-header flex flex-wrap items-center justify-center gap-[0.45em] text-center text-[clamp(28px,4.6vw,56px)] leading-[1.05] font-extrabold text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]"
            id="topHeader"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>{hero.prefix}</span>
            <span
              className="pl2-header-role inline-block font-black text-(--provider-launch-highlight-header)"
              id="roleEl"
            >
              {PROVIDER_LAUNCH_2_ROLES[0]}
            </span>
            <span
              className="pl2-header-wave ml-[clamp(-14px,-0.4em,-8px)] inline-block align-bottom leading-none"
              id="waveEl"
              aria-hidden="true"
            >
              <Image
                className="block size-[clamp(32px,4.2vw,58px)] object-contain"
                src={assets.wave}
                alt=""
                width={48}
                height={48}
                unoptimized
              />
            </span>
          </header>

          <div
            className="pl2-body-copy mx-auto mt-[5vh] min-h-[2.4em] max-w-[1180px] text-center text-[clamp(17px,2.4vw,28px)] leading-[1.45] font-medium text-[#f4eef7] [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]"
            id="bodyCopy"
            aria-live="polite"
            aria-atomic="false"
          />

          <section
            className="mx-auto mt-[5vh] hidden max-w-[1480px] grid-cols-3 gap-x-7 gap-y-6 max-[880px]:max-w-[480px] max-[880px]:grid-cols-1"
            id="cardsWrap"
            aria-label="Product showcase"
          >
            {PROVIDER_LAUNCH_2_SHOWCASE_CARDS.map((card, index) => (
              <ProviderLaunch2ShowcaseCard
                key={card.markupKey}
                cardIndex={index + 1}
                pillTitle={card.pillTitle}
                pillIcon={card.pillIcon}
                footerIcon={card.footerIcon}
                footerText={card.footerText}
                offsetMiddle={index === 1}
              />
            ))}
          </section>

          <section
            className="mx-auto mt-[4vh] hidden max-w-[920px] text-center text-[clamp(15px,2vw,22px)] leading-normal text-[#f4eef7]"
            id="closingWrap"
            aria-label="Closing statement"
          >
            <p className="pl2-closing-line m-0 mb-2" id="close1">
              These are not three separate products. This is one software.
            </p>
          </section>

          <div className="mt-auto flex justify-center pt-[3vh]" id="ctaWrap">
            <Button
              className={cn(
                "pl2-cta-btn shadow-primary/35 h-12 min-w-48 rounded-md px-10 text-base font-extrabold tracking-[0.12em] shadow-lg",
              )}
              id="lockinBtn"
              size="lg"
              type="button"
              aria-label="Lock In - Get started now"
              onClick={() => router.push(links.primaryCta)}
            >
              {hero.ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
