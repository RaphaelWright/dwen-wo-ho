import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const STAGE_CONTROL_BTN_CLASS =
  "flex size-[52px] cursor-pointer items-center justify-center rounded-full border border-border/50 bg-background/30 text-foreground shadow-sm backdrop-blur-md transition-[background,border-color,color,transform,box-shadow] hover:border-foreground/20 hover:bg-background/50 active:scale-95";

const STAGE_CONTROL_ICON_CLASS = "size-[22px] shrink-0";

export function LockIn2StageControls() {
  return (
    <div
      className="li2-stage-controls duration-450ms transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]"
      id="stageControls"
    >
      <button
        type="button"
        className={STAGE_CONTROL_BTN_CLASS}
        id="prevBtn"
        aria-label="Previous influencer"
      >
        <ChevronLeft
          className={STAGE_CONTROL_ICON_CLASS}
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        className={STAGE_CONTROL_BTN_CLASS}
        id="pauseBtn"
        aria-label="Pause animation"
      >
        <Pause
          id="pauseIconPause"
          className={STAGE_CONTROL_ICON_CLASS}
          strokeWidth={2.2}
          aria-hidden="true"
        />
        <Play
          id="pauseIconPlay"
          className={`${STAGE_CONTROL_ICON_CLASS} hidden`}
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        className={STAGE_CONTROL_BTN_CLASS}
        id="nextBtn"
        aria-label="Next influencer"
      >
        <ChevronRight
          className={STAGE_CONTROL_ICON_CLASS}
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
