import { LANDING_2_SEQUENCE_IDS as IDS } from "@/lib/constants/components/marketing/landing-2-sequence";
import { LANDING_2_TIMING } from "@/lib/marketing/landing-2";
import { getElement } from "@/hooks/marketing/landing-2/dom-helpers";

type LabelTimerEl = HTMLElement & { _labelTimer?: number | null };

export function lockInLabelFor(name: string) {
  return `Lock In with @${name}`;
}

export function cancelLockInBtnWidthRelease(btn: HTMLElement) {
  const handler = (
    btn as HTMLElement & { _widthReleaseHandler?: (e: TransitionEvent) => void }
  )._widthReleaseHandler;
  if (!handler) return;

  btn.removeEventListener("transitionend", handler);
  (
    btn as HTMLElement & { _widthReleaseHandler?: (e: TransitionEvent) => void }
  )._widthReleaseHandler = undefined;
}

function releaseLockInBtnWidth(btn: HTMLElement) {
  cancelLockInBtnWidthRelease(btn);

  function onEnd(event: TransitionEvent) {
    if (event.propertyName !== "width") return;
    cancelLockInBtnWidthRelease(btn);
    btn.style.width = "";
  }

  (
    btn as HTMLElement & { _widthReleaseHandler?: (e: TransitionEvent) => void }
  )._widthReleaseHandler = onEnd;
  btn.addEventListener("transitionend", onEnd);
}

function applyLockInLabelAnimation(
  lockInBtn: HTMLElement,
  labelEl: HTMLElement,
  text: string,
) {
  const startWidth = lockInBtn.offsetWidth;
  lockInBtn.style.width = `${startWidth}px`;
  labelEl.classList.add("is-out");

  const timedLabel = labelEl as LabelTimerEl;
  timedLabel._labelTimer = window.setTimeout(() => {
    labelEl.textContent = text;
    lockInBtn.style.width = "auto";
    const endWidth = lockInBtn.offsetWidth;
    lockInBtn.style.width = `${startWidth}px`;

    labelEl.classList.remove("is-out");
    labelEl.classList.add("is-in");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        labelEl.classList.remove("is-in");
        lockInBtn.style.width = `${endWidth}px`;
        releaseLockInBtnWidth(lockInBtn);
      });
    });
    timedLabel._labelTimer = null;
  }, LANDING_2_TIMING.lockInLabelMs / 2);
}

function setInstantLockInLabel(
  lockInBtn: HTMLElement,
  labelEl: LabelTimerEl,
  text: string,
) {
  if (labelEl._labelTimer) clearTimeout(labelEl._labelTimer);
  labelEl._labelTimer = null;
  labelEl.textContent = text;
  labelEl.classList.remove("is-out", "is-in");
  lockInBtn.style.width = "";
}

export function setLockInLabel(
  lockInBtn: HTMLElement,
  text: string,
  instant?: boolean,
) {
  const labelEl = getElement<HTMLElement>(IDS.lockInBtnText);
  if (!labelEl) return;

  cancelLockInBtnWidthRelease(lockInBtn);
  const timedLabel = labelEl as LabelTimerEl;

  if (instant || labelEl.textContent === text) {
    setInstantLockInLabel(lockInBtn, timedLabel, text);
    return;
  }

  if (timedLabel._labelTimer) clearTimeout(timedLabel._labelTimer);
  applyLockInLabelAnimation(lockInBtn, labelEl, text);
}
