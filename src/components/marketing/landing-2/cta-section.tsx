import Link from "next/link";
import { ArrowRight, Stethoscope } from "lucide-react";
import { LANDING_2_CONTENT } from "@/lib/marketing/landing-2";
import { buildPatientJoinRoute } from "@/lib/utils/marketing/landing-2-referral";

export function Landing2CtaSection() {
  const { intro } = LANDING_2_CONTENT;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="bg-footer-bg text-footer-foreground l2-rise grid gap-8 overflow-hidden rounded-2xl p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
        <div>
          <div className="text-primary-foreground/80 inline-flex items-center gap-2 text-sm font-bold">
            <Stethoscope className="size-4" aria-hidden="true" />
            Dwen Wo Ho by JustGo Health
          </div>
          <h2 className="mt-4 max-w-3xl text-4xl leading-tight font-extrabold tracking-[-0.025em] text-balance sm:text-5xl">
            Lock in with care around you.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-white/72">
            Private support for students who want to keep going.
          </p>
        </div>

        <Link
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-extrabold transition-colors"
          href={buildPatientJoinRoute()}
        >
          {intro.lockInDefault}
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
