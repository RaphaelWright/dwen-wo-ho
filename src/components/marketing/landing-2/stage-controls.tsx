import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export function Landing2StageControls() {
  return (
    <div
      className="l2-stage-controls duration-450ms transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]"
      id="l2-stage-controls"
    >
      <button
        type="button"
        className="border-border/50 bg-background/30 text-foreground hover:border-foreground/20 hover:bg-background/50 flex size-[52px] cursor-pointer items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-[background,border-color,color,transform,box-shadow] active:scale-95"
        id="l2-prev-btn"
        aria-label="Previous influencer"
      >
        <ChevronLeft
          className="size-[22px] shrink-0"
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        className="border-border/50 bg-background/30 text-foreground hover:border-foreground/20 hover:bg-background/50 flex size-[52px] cursor-pointer items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-[background,border-color,color,transform,box-shadow] active:scale-95"
        id="l2-pause-btn"
        aria-label="Pause animation"
      >
        <Pause
          id="l2-pause-icon-pause"
          className="size-[22px] shrink-0"
          strokeWidth={2.2}
          aria-hidden="true"
        />
        <Play
          id="l2-pause-icon-play"
          className="hidden size-[22px] shrink-0"
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        className="border-border/50 bg-background/30 text-foreground hover:border-foreground/20 hover:bg-background/50 flex size-[52px] cursor-pointer items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-[background,border-color,color,transform,box-shadow] active:scale-95"
        id="l2-next-btn"
        aria-label="Next influencer"
      >
        <ChevronRight
          className="size-[22px] shrink-0"
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
