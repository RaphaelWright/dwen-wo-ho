import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  LANDING_2_CHARACTERS,
  LANDING_2_CONTENT,
  LANDING_2_HERO_SIGNALS,
  LANDING_2_PRESSURE_LINES,
} from "@/lib/marketing/landing-2";
import { buildPatientJoinRoute } from "@/lib/utils/marketing/landing-2-referral";

export function Landing2Hero() {
  const { intro, links } = LANDING_2_CONTENT;
  const featuredCharacter = LANDING_2_CHARACTERS[0];

  return (
    <section className="relative">
      <div className="l2-soft-orbit absolute inset-x-0 top-0 -z-10 h-[760px] bg-[radial-gradient(circle_at_14%_8%,color-mix(in_srgb,var(--primary)_22%,transparent),transparent_30%),radial-gradient(circle_at_86%_12%,color-mix(in_srgb,var(--secondary-accent)_14%,transparent),transparent_28%)]" />
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,0.96fr)_minmax(390px,1fr)] lg:px-8 lg:py-20">
        <div className="l2-rise max-w-3xl">
          <h1 className="mt-7 max-w-4xl text-5xl leading-[1.01] font-extrabold tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl">
            Lock in without breaking down.
          </h1>

          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8 text-pretty sm:text-xl">
            Dwen Wo Ho gives Ghanaian students a private way to talk, check in,
            and get real care before pressure becomes a crisis.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-extrabold shadow-sm transition-colors"
              href={buildPatientJoinRoute()}
              id="l2-lock-in-btn"
            >
              {intro.lockInDefault}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <Link
              className="border-border bg-background hover:bg-muted inline-flex h-12 items-center justify-center rounded-full border px-6 text-base font-bold transition-colors"
              href={links.pledge}
            >
              Read the pledge
            </Link>
          </div>
        </div>

        <div className="l2-rise l2-rise-delay relative mx-auto w-full max-w-[620px] lg:max-w-none">
          <div className="border-border bg-card relative overflow-hidden rounded-2xl border shadow-sm">
            <div className="grid gap-0 md:grid-cols-[1fr_0.88fr]">
              <div className="bg-muted/65 relative min-h-[390px] overflow-hidden">
                <div className="bg-primary/12 absolute inset-x-8 top-10 h-80 rounded-full blur-3xl" />
                <Image
                  className="relative z-10 h-full min-h-[390px] w-full object-contain object-bottom"
                  src={featuredCharacter.photo}
                  alt={`${featuredCharacter.name}, featured student achiever`}
                  width={900}
                  height={1050}
                  priority
                  sizes="(max-width: 1024px) 90vw, 38vw"
                  unoptimized
                />
              </div>

              <div className="border-border bg-background/95 flex flex-col justify-between border-t p-5 sm:p-6 md:border-t-0 md:border-l">
                <div>
                  <p className="text-primary text-sm font-extrabold">
                    @{featuredCharacter.name}
                  </p>
                  <p className="mt-2 text-2xl leading-tight font-extrabold text-balance">
                    {featuredCharacter.factPrefix}
                    <span className="text-primary">
                      {featuredCharacter.factHighlight}
                    </span>
                    {featuredCharacter.factSuffix}
                  </p>
                </div>

                <div className="mt-8 space-y-2">
                  {LANDING_2_PRESSURE_LINES.map((line) => (
                    <p
                      className="border-border bg-muted/55 rounded-xl border px-4 py-3 text-sm font-bold"
                      key={line}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {LANDING_2_HERO_SIGNALS.map((signal) => (
              <div
                className="border-border bg-background rounded-xl border px-3 py-3 text-center text-sm font-extrabold"
                key={signal}
              >
                {signal}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
