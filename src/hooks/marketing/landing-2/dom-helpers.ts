import { LANDING_2_SEQUENCE_IDS as IDS } from "@/lib/constants/components/marketing/landing-2-sequence";
import { LANDING_2_TIMING } from "@/lib/marketing/landing-2";

export function showElement(el: Element | null) {
  el?.classList.add("in");
}

export function getElement<T extends HTMLElement = HTMLElement>(id: string) {
  return document.getElementById(id) as T | null;
}

export function setAchievementReaction(el: HTMLElement | null, emoji: string) {
  if (!el) return;
  el.dataset.activeEmoji = emoji ?? "";
}

export function showStageControls() {
  getElement(IDS.stageControls)?.classList.add("in");
}

export function hideStageControls() {
  getElement(IDS.stageControls)?.classList.remove("in");
}

export function dropLanding2Nav(instant = false) {
  document.querySelectorAll(".l2-nav-item").forEach((el, index) => {
    if (instant) {
      el.classList.add("is-dropped");
      return;
    }

    window.setTimeout(() => {
      el.classList.add("is-dropped");
    }, index * LANDING_2_TIMING.navDropStagger);
  });
}

export function resetPhotoStyles(photo: HTMLElement) {
  photo.style.left = "";
  photo.style.top = "";
  photo.style.width = "";
  photo.style.height = "";
  photo.style.transform = "";
}

export function applyPhotoStyles(
  photo: HTMLElement,
  styles: Record<string, string>,
) {
  Object.entries(styles).forEach(([prop, value]) => {
    if (value) {
      (photo.style as unknown as Record<string, string>)[prop] = value;
    }
  });
}
