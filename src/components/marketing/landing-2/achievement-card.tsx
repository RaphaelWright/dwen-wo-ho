import type { Landing2AchievementSlot } from "@/lib/types/marketing/landing-2";

export function Landing2AchievementCard({
  slot,
}: {
  slot: Landing2AchievementSlot;
}) {
  return (
    <div
      className="l2-achievement bg-card flex items-center gap-[18px] rounded-3xl border-2 border-transparent px-5 py-4 shadow-sm"
      id={`ach${slot.id}`}
      style={{ top: `${slot.top}px` }}
    >
      <span className="achievement-text text-foreground flex-1 text-[28px] font-bold whitespace-nowrap">
        {slot.text}
      </span>
      <span
        className="l2-achievement-reaction achievement-emoji flex size-12 shrink-0 items-center justify-center text-[40px] leading-none"
        id={`achReaction${slot.id}`}
        aria-hidden="true"
      >
        {slot.emoji}
      </span>
    </div>
  );
}
