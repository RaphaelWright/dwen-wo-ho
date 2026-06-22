import type { LockIn2AchievementCardProps } from "@/lib/types/components/marketing/lock-in-2";
import { cn } from "@/lib/utils";

const cardStatusClass = {
  idle: "",
  active: "in active",
  passive: "in passive",
} as const;

const emojiStatusClass = {
  idle: "",
  active: "active",
  passive: "passive",
} as const;

export function LockIn2AchievementCard({
  slot,
  status = "idle",
}: LockIn2AchievementCardProps) {
  return (
    <div
      className={cn(
        "li2-achievement bg-card flex items-center gap-[18px] rounded-3xl border-2 border-transparent px-5 py-4 shadow-sm",
        cardStatusClass[status],
      )}
      id={`ach${slot.id}`}
      style={{ top: `${slot.top}px` }}
    >
      <span className="achievement-text text-foreground flex-1 text-[28px] font-bold whitespace-nowrap">
        {slot.text}
      </span>
      <span
        className={cn(
          "li2-achievement-reaction achievement-emoji flex size-12 shrink-0 items-center justify-center text-[40px] leading-none",
          emojiStatusClass[status],
        )}
        id={`achReaction${slot.id}`}
        aria-hidden="true"
      >
        {slot.emoji}
      </span>
    </div>
  );
}
