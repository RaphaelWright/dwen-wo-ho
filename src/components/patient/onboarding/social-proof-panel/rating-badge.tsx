import { Star } from "lucide-react";
import { RatingBadgeProps } from "@/lib/types/components/patient/onboarding";

const STAR_COUNT = 5;
const STAR_ARC_OFFSETS = [-14, -7, 0, 7, 14];

export function RatingBadge({ rating, label }: RatingBadgeProps) {
  return (
    <div
      className="flex size-[5.75rem] shrink-0 flex-col items-center justify-center gap-0.5 rounded-full border border-white/20 bg-black/35 text-center shadow-lg backdrop-blur-md lg:size-[6.25rem]"
      aria-label={`${label}: ${rating.toFixed(1)} out of 5`}
    >
      <div
        className="mb-0.5 flex items-end justify-center gap-px"
        aria-hidden="true"
      >
        {Array.from({ length: STAR_COUNT }, (_, index) => (
          <Star
            key={index}
            className="text-warm-sand size-2 fill-current lg:size-2.5"
            style={{ transform: `rotate(${STAR_ARC_OFFSETS[index]}deg)` }}
          />
        ))}
      </div>
      <span className="font-heading text-xl leading-none font-bold text-white lg:text-2xl">
        {rating.toFixed(1)}
      </span>
      <span className="max-w-[4.75rem] text-[8px] leading-tight font-semibold tracking-[0.12em] text-white/45 uppercase lg:text-[9px]">
        {label}
      </span>
    </div>
  );
}
