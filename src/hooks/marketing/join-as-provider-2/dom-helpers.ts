import { JOIN_AS_PROVIDER_2_SEQUENCE_IDS as IDS } from "@/lib/constants/components/marketing/join-as-provider-2-sequence";

export const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

export function fadeInElement(el: Element | null) {
  el?.classList.add("is-visible");
}

export function getElement<T extends HTMLElement = HTMLElement>(id: string) {
  return document.getElementById(id) as T | null;
}

export function getCardElements(
  pinId: string,
  pillId: string,
  bubbleId: string,
  bodyId: string,
  footerId: string,
) {
  const elements = [pinId, pillId, bubbleId, bodyId, footerId].map((id) =>
    getElement(id),
  );
  if (elements.some((el) => !el)) return null;

  return {
    pin: elements[0] as HTMLElement,
    pill: elements[1] as HTMLElement,
    bubble: elements[2] as HTMLElement,
    body: elements[3] as HTMLElement,
    footer: elements[4] as HTMLElement,
  };
}

type ScheduleFn = (callback: () => void, delay: number) => void;

export function dropJoinAsProvider2Nav(
  instant = false,
  schedule: ScheduleFn = (fn, delay) => {
    window.setTimeout(fn, delay);
  },
) {
  document.querySelectorAll(".j2-nav-item").forEach((el, index) => {
    if (instant) {
      el.classList.add("is-dropped");
      return;
    }

    schedule(() => el.classList.add("is-dropped"), index * 150);
  });
}

export { IDS };
