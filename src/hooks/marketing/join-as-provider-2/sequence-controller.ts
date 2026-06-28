import {
  JOIN_AS_PROVIDER_2_BUBBLE_MARKUP,
  JOIN_AS_PROVIDER_2_CARD_REVEAL_TIMING,
  JOIN_AS_PROVIDER_2_CONTENT,
  JOIN_AS_PROVIDER_2_MARKUP_NARRATIVE,
  JOIN_AS_PROVIDER_2_ROLES,
  JOIN_AS_PROVIDER_2_SHOWCASE_CARDS,
} from "@/lib/marketing/join-as-providers-2";
import {
  disintegrateMarkup,
  getMarkupCharCount,
  renderMarkupInstant,
  typeMarkupAt,
} from "@/lib/marketing/markup-animation";
import {
  dropJoinAsProvider2Nav,
  fadeInElement,
  getCardElements,
  getElement,
  IDS,
} from "@/hooks/marketing/join-as-provider-2/dom-helpers";

export class JoinAsProvider2SequenceController {
  private roleNode: HTMLElement;
  private waveNode: HTMLElement;
  private headerNode: HTMLElement;
  private bodyCopyNode: HTMLElement;
  private scaleRootNode: HTMLElement;
  private cardsWrapNode: HTMLElement;
  private closingWrapNode: HTMLElement;
  private lockInBtnNode: HTMLElement;
  private timeoutIds = new Set<number>();

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
    lockInBtnNode: HTMLElement;
  }) {
    this.roleNode = nodes.roleNode;
    this.waveNode = nodes.waveNode;
    this.headerNode = nodes.headerNode;
    this.bodyCopyNode = nodes.bodyCopyNode;
    this.scaleRootNode = nodes.scaleRootNode;
    this.cardsWrapNode = nodes.cardsWrapNode;
    this.closingWrapNode = nodes.closingWrapNode;
    this.lockInBtnNode = nodes.lockInBtnNode;

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
    this.roleTimer = null;
    this.clearAllTimeouts();
    this.resizeObserver.disconnect();
    window.removeEventListener("resize", this.boundApplyScale);
  }

  private isActive = () => !this.destroyed;

  private scheduleTimeout(callback: () => void, delayMs: number) {
    const id = window.setTimeout(() => {
      this.timeoutIds.delete(id);
      if (!this.isActive()) return;
      callback();
    }, delayMs);
    this.timeoutIds.add(id);
    return id;
  }

  private clearAllTimeouts() {
    for (const id of this.timeoutIds) {
      clearTimeout(id);
    }
    this.timeoutIds.clear();
  }

  private wait(ms: number) {
    if (!this.isActive()) {
      return Promise.resolve(false);
    }

    return new Promise<boolean>((resolve) => {
      this.scheduleTimeout(() => resolve(this.isActive()), ms);
    });
  }

  private dropNav(instant = false) {
    dropJoinAsProvider2Nav(instant, (fn, delayMs) => {
      this.scheduleTimeout(fn, delayMs);
    });
  }

  private applyScale() {
    if (!this.isActive() || !this.scaleRootNode.isConnected) return;

    const natural = this.scaleRootNode.scrollHeight;
    const ctaReserve = this.lockInBtnNode.offsetHeight + 48;
    const available = window.innerHeight - 6 - ctaReserve;
    const scale = Math.min(1, available / natural);
    this.scaleRootNode.style.transform = `scale(${scale})`;
  }

  private swapRole() {
    if (!this.isActive() || !this.roleNode.isConnected) return;

    this.roleIndex = (this.roleIndex + 1) % JOIN_AS_PROVIDER_2_ROLES.length;
    this.roleNode.classList.add("is-exiting");
    this.scheduleTimeout(() => {
      if (!this.isActive() || !this.roleNode.isConnected) return;

      this.roleNode.textContent = JOIN_AS_PROVIDER_2_ROLES[this.roleIndex];
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

  private getCardStaggerOffsetMs(
    markupKey: keyof typeof JOIN_AS_PROVIDER_2_BUBBLE_MARKUP,
  ) {
    const {
      pinDelayMs,
      pillDelayMs,
      bubbleDelayMs,
      typingSpeedMs,
      typingNearCompleteRatio,
    } = JOIN_AS_PROVIDER_2_CARD_REVEAL_TIMING;
    const leadInMs = pinDelayMs + pillDelayMs + bubbleDelayMs;
    const typingMs =
      getMarkupCharCount(JOIN_AS_PROVIDER_2_BUBBLE_MARKUP[markupKey]) *
      typingSpeedMs;

    return leadInMs + typingMs * typingNearCompleteRatio;
  }

  private async revealCard(
    cardIndex: number,
    markupKey: keyof typeof JOIN_AS_PROVIDER_2_BUBBLE_MARKUP,
    startDelay = 0,
  ) {
    const { pinDelayMs, pillDelayMs, bubbleDelayMs, typingSpeedMs } =
      JOIN_AS_PROVIDER_2_CARD_REVEAL_TIMING;

    if (!(await this.wait(startDelay))) return;

    const elements = getCardElements(
      IDS.cardPin(cardIndex),
      IDS.cardPill(cardIndex),
      IDS.cardBubble(cardIndex),
      IDS.cardBody(cardIndex),
      IDS.cardFooter(cardIndex),
    );
    if (!elements) return;

    elements.pin.classList.add("is-visible");
    if (!(await this.wait(pinDelayMs))) return;
    elements.pill.classList.add("is-visible");
    if (!(await this.wait(pillDelayMs))) return;
    elements.bubble.classList.add("is-visible");
    if (!(await this.wait(bubbleDelayMs))) return;

    await typeMarkupAt(
      elements.body,
      JOIN_AS_PROVIDER_2_BUBBLE_MARKUP[markupKey],
      typingSpeedMs,
      () => !this.isActive(),
    );
    if (!this.isActive()) return;

    elements.body.querySelector(".j2-cursor")?.remove();
    if (!(await this.wait(500))) return;
    elements.footer.classList.add("is-visible");
  }

  private async runShowcaseCardsStaggered() {
    const cardPromises: Promise<void>[] = [];
    let startDelay = 0;

    JOIN_AS_PROVIDER_2_SHOWCASE_CARDS.forEach((card, index) => {
      cardPromises.push(this.revealCard(index + 1, card.markupKey, startDelay));

      if (index < JOIN_AS_PROVIDER_2_SHOWCASE_CARDS.length - 1) {
        startDelay += this.getCardStaggerOffsetMs(card.markupKey);
      }
    });

    await Promise.all(cardPromises);
  }

  private async runNarrativePhase() {
    const { timing } = JOIN_AS_PROVIDER_2_CONTENT;

    await typeMarkupAt(
      this.bodyCopyNode,
      JOIN_AS_PROVIDER_2_MARKUP_NARRATIVE.line1,
      32,
      () => !this.isActive(),
    );
    if (!(await this.wait(timing.lineHoldMs))) return;

    await disintegrateMarkup(
      this.bodyCopyNode,
      JOIN_AS_PROVIDER_2_MARKUP_NARRATIVE.line1,
      1800,
      () => !this.isActive(),
    );
    if (!this.isActive() || !this.bodyCopyNode.isConnected) return;

    this.bodyCopyNode.innerHTML = "";
    if (!(await this.wait(500))) return;

    await typeMarkupAt(
      this.bodyCopyNode,
      JOIN_AS_PROVIDER_2_MARKUP_NARRATIVE.line2,
      32,
      () => !this.isActive(),
    );
    if (!(await this.wait(timing.lineHoldMs))) return;

    await disintegrateMarkup(
      this.bodyCopyNode,
      JOIN_AS_PROVIDER_2_MARKUP_NARRATIVE.line2,
      1800,
      () => !this.isActive(),
    );
    if (!this.isActive() || !this.bodyCopyNode.isConnected) return;

    this.bodyCopyNode.innerHTML = "";
    await this.wait(500);
  }

  private revealShowcaseGrid() {
    this.cardsWrapNode.classList.remove("hidden");
    this.cardsWrapNode.classList.add("grid");
    this.applyScale();
  }

  private revealClosingSection() {
    this.closingWrapNode.classList.remove("hidden");
    this.closingWrapNode.classList.add("block");
    this.applyScale();
  }

  private async runSequence() {
    const { timing } = JOIN_AS_PROVIDER_2_CONTENT;

    this.dropNav();
    if (!(await this.wait(timing.showWaveDelayMs))) return;

    fadeInElement(this.headerNode);
    if (!(await this.wait(2000))) return;

    this.waveNode.classList.add("is-dropped");
    if (!(await this.wait(600))) return;

    this.waveNode.classList.add("is-shaking");
    if (!(await this.wait(2000))) return;

    this.startRoleCycle(timing.roleRotationMs);
    if (!(await this.wait(700))) return;

    await this.runNarrativePhase();
    if (!this.isActive()) return;

    this.revealShowcaseGrid();
    if (!(await this.wait(50))) return;

    await this.runShowcaseCardsStaggered();
    if (!(await this.wait(1500))) return;

    this.revealClosingSection();
    if (!(await this.wait(50))) return;

    fadeInElement(getElement(IDS.closingLine));
    if (!(await this.wait(timing.closingDelayMs))) return;

    fadeInElement(getElement(IDS.closingLine2));
    if (!(await this.wait(timing.ctaDelayMs))) return;

    this.lockInBtnNode.classList.add("is-visible");
  }

  private showFinalStateInstantly() {
    this.dropNav(true);
    fadeInElement(this.headerNode);
    this.waveNode.classList.add("is-dropped");
    this.revealShowcaseGrid();
    this.revealClosingSection();

    JOIN_AS_PROVIDER_2_SHOWCASE_CARDS.forEach((card, index) => {
      const cardIndex = index + 1;
      getElement(IDS.cardPin(cardIndex))?.classList.add("is-visible");
      getElement(IDS.cardPill(cardIndex))?.classList.add("is-visible");
      getElement(IDS.cardBubble(cardIndex))?.classList.add("is-visible");
      getElement(IDS.cardFooter(cardIndex))?.classList.add("is-visible");

      const body = getElement(IDS.cardBody(cardIndex));
      if (body) {
        renderMarkupInstant(
          body,
          JOIN_AS_PROVIDER_2_BUBBLE_MARKUP[card.markupKey],
        );
      }
    });

    fadeInElement(getElement(IDS.closingLine));
    fadeInElement(getElement(IDS.closingLine2));
    this.lockInBtnNode.classList.add("is-visible");
    this.applyScale();
  }
}
