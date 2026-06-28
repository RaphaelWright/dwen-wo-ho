"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { JoinAsProvider2ShowcaseCard } from "@/components/marketing/join-as-provider-2/showcase-card";
import {
  JOIN_AS_PROVIDER_2_CONTENT,
  JOIN_AS_PROVIDER_2_ROLES,
  JOIN_AS_PROVIDER_2_SHOWCASE_CARDS,
} from "@/lib/marketing/join-as-providers-2";
import { useJoinAsProvider2Sequence } from "@/hooks/marketing/join-as-provider-2/use-sequence";

export function JoinAsProvider2() {
  const router = useRouter();
  const { hero, links, assets, navigation } = JOIN_AS_PROVIDER_2_CONTENT;

  useJoinAsProvider2Sequence();

  return (
    <div
      className="join-as-provider-2-shell bg-footer-bg fixed inset-0 overflow-hidden overscroll-none text-[#f4eef7] antialiased"
      id="joinAsProvider2Shell"
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

      <nav
        className="fixed top-0 right-0 left-0 z-50 backdrop-blur-xs"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex h-14 items-center justify-between px-7 max-[880px]:flex-wrap max-[880px]:gap-3 max-[480px]:px-4 sm:h-16">
          <div className="j2-nav-item shrink-0" id="navLogo">
            <Logo
              withLink
              href={links.home as Route}
              variant="white"
              className="w-32 sm:w-36"
            />
          </div>

          <Link
            className="j2-nav-item text-primary-foreground/85 hover:text-primary-foreground text-[17px] font-bold no-underline transition-colors duration-200 max-[880px]:text-sm max-[480px]:text-xs"
            href={links.joinAsProvider as Route}
            id="navLink"
            aria-current="page"
          >
            {navigation.currentLabel}
          </Link>

          <Button
            className="j2-nav-item rounded-full"
            id="navCta"
            type="button"
            aria-label="Get started with JustGo Health"
            onClick={() => router.push(links.primaryCta)}
          >
            {navigation.primaryCta}
          </Button>
        </div>
      </nav>

      <div className="fixed inset-0 z-1 flex h-full items-start justify-center overflow-hidden">
        <div
          className="flex min-h-full w-full max-w-[1480px] origin-top flex-col px-7 pt-20 pb-10 will-change-transform max-[480px]:p-4 max-[480px]:pt-16"
          id="scaleRoot"
        >
          <header
            className="j2-header flex flex-wrap items-center justify-center gap-[0.45em] text-center text-[clamp(28px,4.6vw,56px)] leading-[1.05] font-extrabold text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]"
            id="topHeader"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>{hero.prefix}</span>
            <span
              className="j2-header-role text-join-as-provider-2-highlight-header inline-block font-black"
              id="roleEl"
            >
              {JOIN_AS_PROVIDER_2_ROLES[0]}
            </span>
            <span
              className="j2-header-wave ml-[clamp(-14px,-0.4em,-8px)] inline-block align-bottom leading-none"
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
            className="j2-body-copy mx-auto mt-[5vh] min-h-[2.4em] max-w-[1180px] text-center text-[clamp(17px,2.4vw,28px)] leading-[1.45] font-medium text-[#f4eef7] [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]"
            id="bodyCopy"
            aria-live="polite"
            aria-atomic="false"
          />

          <section
            className="mx-auto mt-[5vh] hidden max-w-[1480px] grid-cols-3 gap-x-7 gap-y-6 max-[880px]:max-w-[480px] max-[880px]:grid-cols-1"
            id="cardsWrap"
            aria-label="Product showcase"
          >
            {JOIN_AS_PROVIDER_2_SHOWCASE_CARDS.map((card, index) => (
              <JoinAsProvider2ShowcaseCard
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
            <p className="j2-closing-line m-0 mb-2" id="close1">
              {JOIN_AS_PROVIDER_2_CONTENT.closing.lines[0]}
            </p>
            <p className="j2-closing-line m-0" id="close2">
              {JOIN_AS_PROVIDER_2_CONTENT.closing.lines[1]}
            </p>
          </section>
        </div>

        <div
          className="pointer-events-none fixed right-0 bottom-[max(1.25rem,3vh)] left-0 z-10 flex justify-center"
          id="ctaWrap"
        >
          <Button
            className="j2-cta-btn shadow-primary/35 pointer-events-auto h-12 min-w-48 rounded-md px-10 text-base font-extrabold tracking-[0.12em] shadow-lg"
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
  );
}
