import { TestimonialQuoteProps } from "@/lib/types/components/patient/onboarding";

export function TestimonialQuote({ quote }: TestimonialQuoteProps) {
  return (
    <blockquote className="border-warm-sand/80 max-w-md border-l-2 pl-5 text-base leading-relaxed text-white italic lg:text-lg lg:leading-relaxed">
      &ldquo;{quote}&rdquo;
    </blockquote>
  );
}
