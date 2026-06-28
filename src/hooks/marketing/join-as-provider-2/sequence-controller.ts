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
  delay,
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
    this.resizeObserver.disconnect();
    window.removeEventListener("resize", this.boundApplyScale);
  }

  private isCancelled = () => this.destroyed;

  private applyScale() {
    const natural = this.scaleRootNode.scrollHeight;
    const ctaReserve = this.lockInBtnNode.offsetHeight + 48;
    const available = window.innerHeight - 6 - ctaReserve;
    const scale = Math.min(1, available / natural);
    this.scaleRootNode.style.transform = `scale(${scale})`;
  }

  private swapRole() {
    this.roleIndex = (this.roleIndex + 1) % JOIN_AS_PROVIDER_2_ROLES.length;
    this.roleNode.classList.add("is-exiting");
    window.setTimeout(() => {
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

    await delay(startDelay);
    if (this.destroyed) return;

    const elements = getCardElements(
      IDS.cardPin(cardIndex),
      IDS.cardPill(cardIndex),
      IDS.cardBubble(cardIndex),
      IDS.cardBody(cardIndex),
      IDS.cardFooter(cardIndex),
    );
    if (!elements) return;

    elements.pin.classList.add("is-visible");
    await delay(pinDelayMs);
    elements.pill.classList.add("is-visible");
    await delay(pillDelayMs);
    elements.bubble.classList.add("is-visible");
    await delay(bubbleDelayMs);
    await typeMarkupAt(
      elements.body,
      JOIN_AS_PROVIDER_2_BUBBLE_MARKUP[markupKey],
      typingSpeedMs,
      this.isCancelled,
    );
    elements.body.querySelector(".j2-cursor")?.remove();
    await delay(500);
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
      this.isCancelled,
    );
    await delay(timing.lineHoldMs);
    await disintegrateMarkup(
      this.bodyCopyNode,
      JOIN_AS_PROVIDER_2_MARKUP_NARRATIVE.line1,
      1800,
    );
    this.bodyCopyNode.innerHTML = "";
    await delay(500);

    await typeMarkupAt(
      this.bodyCopyNode,
      JOIN_AS_PROVIDER_2_MARKUP_NARRATIVE.line2,
      32,
      this.isCancelled,
    );
    await delay(timing.lineHoldMs);
    await disintegrateMarkup(
      this.bodyCopyNode,
      JOIN_AS_PROVIDER_2_MARKUP_NARRATIVE.line2,
      1800,
    );
    this.bodyCopyNode.innerHTML = "";
    await delay(500);
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

    dropJoinAsProvider2Nav();
    await delay(timing.showWaveDelayMs);

    fadeInElement(this.headerNode);
    await delay(2000);

    this.waveNode.classList.add("is-dropped");
    await delay(600);
    this.waveNode.classList.add("is-shaking");
    await delay(2000);

    this.startRoleCycle(timing.roleRotationMs);
    await delay(700);

    await this.runNarrativePhase();

    this.revealShowcaseGrid();
    await delay(50);

    await this.runShowcaseCardsStaggered();
    await delay(1500);

    this.revealClosingSection();
    await delay(50);
    fadeInElement(getElement(IDS.closingLine));
    await delay(timing.closingDelayMs);
    fadeInElement(getElement(IDS.closingLine2));
    await delay(timing.ctaDelayMs);
    this.lockInBtnNode.classList.add("is-visible");
  }

  private showFinalStateInstantly() {
    dropJoinAsProvider2Nav(true);
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
