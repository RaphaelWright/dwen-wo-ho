import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { TestimonialQuote } from "@/components/patient/onboarding/social-proof-panel/testimonial-quote";
import { StudentMeta } from "@/components/patient/onboarding/social-proof-panel/student-meta";
import { RatingBadge } from "@/components/patient/onboarding/social-proof-panel/rating-badge";
import { ONBOARDING_SOCIAL_PROOF } from "@/lib/constants/components/patient/onboarding";

export function SocialProofPanel() {
  return (
    <aside className="relative hidden h-dvh w-full shrink-0 overflow-hidden lg:block lg:w-1/2">
      <Image
        src="/amanda.jpg"
        alt="Amanda"
        fill
        quality={100}
        className="object-cover object-[center_20%]"
        sizes="50vw"
        priority
        blurDataURL="/amanda.jpg"
        placeholder="blur"
      />
      <div className="absolute inset-0 bg-[#121212]/75" />
      <div className="from-primary/30 absolute inset-0 bg-linear-to-br via-transparent to-black/50" />

      <div className="relative z-10 flex h-full flex-col px-5 pt-6 pb-3 lg:px-8 lg:pt-7 lg:pb-4">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <Logo variant="white" className="w-32 shrink-0 lg:w-40" />
          <p className="text-warm-sand/80 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
            <GraduationCap className="size-4 shrink-0" aria-hidden="true" />
            Student spotlight
          </p>
        </div>

        <div aria-hidden="true" className="min-h-0 flex-1" />

        <div className="shrink-0">
          <p className="font-heading text-warm-sand border-warm-sand/70 w-fit border-b pb-2 text-4xl leading-none font-normal tracking-tight lg:text-[2.75rem]">
            {ONBOARDING_SOCIAL_PROOF.name}
          </p>

          <div className="mt-8 lg:mt-9">
            <TestimonialQuote quote={ONBOARDING_SOCIAL_PROOF.quote} />
          </div>

          <div className="mt-9 flex items-end justify-between gap-3 lg:mt-10 lg:gap-4">
            <StudentMeta
              programme={ONBOARDING_SOCIAL_PROOF.programme}
              school={ONBOARDING_SOCIAL_PROOF.school}
            />
            <RatingBadge
              rating={ONBOARDING_SOCIAL_PROOF.rating}
              label={ONBOARDING_SOCIAL_PROOF.ratingLabel}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
