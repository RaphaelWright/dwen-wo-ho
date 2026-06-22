"use client";

import { useEffect } from "react";
import {
  PROVIDER_LAUNCH_2_BUBBLE_MARKUP,
  PROVIDER_LAUNCH_2_MARKUP_NARRATIVE,
  PROVIDER_LAUNCH_2_SHOWCASE_CARDS,
  PROVIDER_LAUNCH_2_ROLES,
} from "@/lib/constants/components/marketing/provider-launch-2";
import {
  disintegrateMarkup,
  renderMarkupInstant,
  typeMarkupAt,
} from "@/lib/utils/marketing/provider-launch-2/markup-animation";

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

function fadeIn(el: Element | null) {
  el?.classList.add("is-visible");
}

function getCardElements(
  pinId: string,
  pillId: string,
  bubbleId: string,
  bodyId: string,
  footerId: string,
) {
  const ids = [pinId, pillId, bubbleId, bodyId, footerId];
  const els = ids.map((id) => document.getElementById(id));
  if (els.some((el) => !el)) return null;
  return {
    pin: els[0] as HTMLElement,
    pill: els[1] as HTMLElement,
    bubble: els[2] as HTMLElement,
    body: els[3] as HTMLElement,
    footer: els[4] as HTMLElement,
  };
}

class ProviderLaunch2SequenceController {
  private roleNode: HTMLElement;
  private waveNode: HTMLElement;
  private headerNode: HTMLElement;
  private bodyCopyNode: HTMLElement;
  private scaleRootNode: HTMLElement;
  private cardsWrapNode: HTMLElement;
  private closingWrapNode: HTMLElement;
  private lockinBtnNode: HTMLElement;

  private roleIndex = 0;
  private roleTimer: ReturnType<typeof setInterval> | null = null;
  private destroyed = false;
  private resizeObserver: ResizeObserver;

  private boundApplyScale: () => void;

  constructor(nodes: {
    roleNode: HTMLElement;
    waveNode: HTMLElement;
    headerNode: HTMLElement;
    bodyCopyNode: HTMLElement;
    scaleRootNode: HTMLElement;
    cardsWrapNode: HTMLElement;
    closingWrapNode: HTMLElement;
    lockinBtnNode: HTMLElement;
  }) {
    this.roleNode = nodes.roleNode;
    this.waveNode = nodes.waveNode;
    this.headerNode = nodes.headerNode;
    this.bodyCopyNode = nodes.bodyCopyNode;
    this.scaleRootNode = nodes.scaleRootNode;
    this.cardsWrapNode = nodes.cardsWrapNode;
    this.closingWrapNode = nodes.closingWrapNode;
    this.lockinBtnNode = nodes.lockinBtnNode;

    this.boundApplyScale = () => this.applyScale();
    this.resizeObserver = new ResizeObserver(this.boundApplyScale);
  }

  public mount() {
    window.addEventListener("resize", this.boundApplyScale);
    this.resizeObserver.observe(this.scaleRootNode);
    this.applyScale();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.showFinalStateInstantly();
    } else {
      void this.runSequence();
    }
  }

  public unmount() {
    this.destroyed = true;
    if (this.roleTimer) clearInterval(this.roleTimer);
    this.resizeObserver.disconnect();
    window.removeEventListener("resize", this.boundApplyScale);
  }

  private isCancelled = () => this.destroyed;

  private applyScale() {
    const natural = this.scaleRootNode.scrollHeight;
    const available = window.innerHeight - 6;
    const scale = Math.min(1, available / natural);
    this.scaleRootNode.style.transform = `scale(${scale})`;
  }

  private dropNav() {
    document.querySelectorAll(".pl2-nav-item").forEach((el, i) => {
      window.setTimeout(() => {
        el.classList.add("is-dropped");
      }, i * 150);
    });
  }

  private swapRole() {
    this.roleIndex = (this.roleIndex + 1) % PROVIDER_LAUNCH_2_ROLES.length;
    this.roleNode.classList.add("is-exiting");
    window.setTimeout(() => {
      this.roleNode.textContent = PROVIDER_LAUNCH_2_ROLES[this.roleIndex];
      this.roleNode.classList.remove("is-exiting");
      this.waveNode.classList.remove("is-shaking");
      void this.waveNode.getBoundingClientRect().width;
      this.waveNode.classList.add("is-shaking");
    }, 420);
  }

  private startRoleCycle(intervalMs: number) {
    if (this.roleTimer) clearInterval(this.roleTimer);
    this.roleTimer = setInterval(() => this.swapRole(), intervalMs);
  }

  private async revealCard(
    pinId: string,
    pillId: string,
    bubbleId: string,
    bodyId: string,
    footerId: string,
    text: string,
    startDelay = 0,
  ) {
    await delay(startDelay);
    if (this.destroyed) return;

    const els = getCardElements(pinId, pillId, bubbleId, bodyId, footerId);
    if (!els) return;

    els.pin.classList.add("is-visible");
    await delay(500);
    els.pill.classList.add("is-visible");
    await delay(700);
    els.bubble.classList.add("is-visible");
    await delay(900);
    await typeMarkupAt(els.body, text, 22, this.isCancelled);
    els.body.querySelector(".pl2-cursor")?.remove();
    await delay(500);
    els.footer.classList.add("is-visible");
  }

  private async runNarrativePhase() {
    await typeMarkupAt(
      this.bodyCopyNode,
      PROVIDER_LAUNCH_2_MARKUP_NARRATIVE.line1,
      32,
      this.isCancelled,
    );
    await delay(3000);
    await disintegrateMarkup(
      this.bodyCopyNode,
      PROVIDER_LAUNCH_2_MARKUP_NARRATIVE.line1,
      1800,
    );
    this.bodyCopyNode.innerHTML = "";
    await delay(500);

    await typeMarkupAt(
      this.bodyCopyNode,
      PROVIDER_LAUNCH_2_MARKUP_NARRATIVE.line2,
      32,
      this.isCancelled,
    );
    await delay(3000);
    await disintegrateMarkup(
      this.bodyCopyNode,
      PROVIDER_LAUNCH_2_MARKUP_NARRATIVE.line2,
      1800,
    );
    this.bodyCopyNode.innerHTML = "";
    await delay(500);
  }

  private async runSequence() {
    this.dropNav();
    await delay(900);

    fadeIn(this.headerNode);
    this.lockinBtnNode.classList.add("is-visible");
    await delay(2000);

    this.waveNode.classList.add("is-dropped");
    await delay(600);
    this.waveNode.classList.add("is-shaking");
    await delay(2000);

    this.startRoleCycle(2800);
    await delay(700);

    await this.runNarrativePhase();

    this.cardsWrapNode.classList.remove("hidden");
    this.cardsWrapNode.classList.add("grid");
    this.applyScale();
    await delay(50);

    await Promise.all(
      PROVIDER_LAUNCH_2_SHOWCASE_CARDS.map((card, index) => {
        const n = index + 1;
        return this.revealCard(
          `pin${n}`,
          `pill${n}`,
          `bubble${n}`,
          `body${n}`,
          `footer${n}`,
          PROVIDER_LAUNCH_2_BUBBLE_MARKUP[card.markupKey],
          card.revealDelayMs,
        );
      }),
    );
    await delay(1500);

    this.closingWrapNode.classList.remove("hidden");
    this.closingWrapNode.classList.add("block");
    this.applyScale();
    await delay(50);
    fadeIn(document.getElementById("close1"));
    await delay(700);
  }

  private showFinalStateInstantly() {
    document
      .querySelectorAll(".pl2-nav-item")
      .forEach((el) => el.classList.add("is-dropped"));
    fadeIn(this.headerNode);
    this.waveNode.classList.add("is-dropped");
    this.cardsWrapNode.classList.remove("hidden");
    this.cardsWrapNode.classList.add("grid");
    this.closingWrapNode.classList.remove("hidden");
    this.closingWrapNode.classList.add("block");

    PROVIDER_LAUNCH_2_SHOWCASE_CARDS.forEach((card, index) => {
      const n = index + 1;
      document.getElementById(`pin${n}`)?.classList.add("is-visible");
      document.getElementById(`pill${n}`)?.classList.add("is-visible");
      document.getElementById(`bubble${n}`)?.classList.add("is-visible");
      document.getElementById(`footer${n}`)?.classList.add("is-visible");
      const body = document.getElementById(`body${n}`);
      if (body) {
        renderMarkupInstant(
          body,
          PROVIDER_LAUNCH_2_BUBBLE_MARKUP[card.markupKey],
        );
      }
    });

    fadeIn(document.getElementById("close1"));
    this.lockinBtnNode.classList.add("is-visible");
    this.applyScale();
  }
}

export function useProviderLaunch2Sequence() {
  useEffect(() => {
    const roleNode = document.getElementById("roleEl");
    const waveNode = document.getElementById("waveEl");
    const headerNode = document.getElementById("topHeader");
    const bodyCopyNode = document.getElementById("bodyCopy");
    const scaleRootNode = document.getElementById("scaleRoot");
    const cardsWrapNode = document.getElementById("cardsWrap");
    const closingWrapNode = document.getElementById("closingWrap");
    const lockinBtnNode = document.getElementById("lockinBtn");

    const els = [
      roleNode,
      waveNode,
      headerNode,
      bodyCopyNode,
      scaleRootNode,
      cardsWrapNode,
      closingWrapNode,
      lockinBtnNode,
    ];

    if (!els.every(Boolean)) {
      return () => {};
    }

    const ctrl = new ProviderLaunch2SequenceController({
      roleNode: roleNode as HTMLElement,
      waveNode: waveNode as HTMLElement,
      headerNode: headerNode as HTMLElement,
      bodyCopyNode: bodyCopyNode as HTMLElement,
      scaleRootNode: scaleRootNode as HTMLElement,
      cardsWrapNode: cardsWrapNode as HTMLElement,
      closingWrapNode: closingWrapNode as HTMLElement,
      lockinBtnNode: lockinBtnNode as HTMLElement,
    });

    ctrl.mount();
    return () => ctrl.unmount();
  }, []);
}
