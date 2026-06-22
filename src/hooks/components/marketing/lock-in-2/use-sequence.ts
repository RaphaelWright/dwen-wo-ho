"use client";

import { useEffect } from "react";
import {
  LOCK_IN_2_CHARACTERS,
  LOCK_IN_2_CONTENT,
  LOCK_IN_2_TIMING,
} from "@/lib/constants/components/marketing/lock-in-2";
import type { LockIn2Character } from "@/lib/types/components/marketing/lock-in-2";
import {
  loadHeroPaletteFromPhoto,
  resetHeroPalette,
} from "@/lib/utils/marketing/lock-in-2/hero-palette";
import { typeText } from "@/lib/utils/marketing/lock-in-2/type-text";

function show(el: Element | null) {
  el?.classList.add("in");
}

function setAchievementReaction(el: HTMLElement | null, emoji: string) {
  if (!el) return;
  el.dataset.activeEmoji = emoji ?? "";
}

function cancelLockInBtnWidthRelease(btn: HTMLElement) {
  const handler = (
    btn as HTMLElement & {
      _widthReleaseHandler?: (e: TransitionEvent) => void;
    }
  )._widthReleaseHandler;
  if (handler) {
    btn.removeEventListener("transitionend", handler);
    (
      btn as HTMLElement & {
        _widthReleaseHandler?: (e: TransitionEvent) => void;
      }
    )._widthReleaseHandler = undefined;
  }
}

function releaseLockInBtnWidth(btn: HTMLElement) {
  cancelLockInBtnWidthRelease(btn);
  function onEnd(e: TransitionEvent) {
    if (e.propertyName !== "width") return;
    cancelLockInBtnWidthRelease(btn);
    btn.style.width = "";
  }
  (
    btn as HTMLElement & {
      _widthReleaseHandler?: (e: TransitionEvent) => void;
    }
  )._widthReleaseHandler = onEnd;
  btn.addEventListener("transitionend", onEnd);
}

function resetPhotoStyles(photo: HTMLElement) {
  photo.style.left = "";
  photo.style.top = "";
  photo.style.width = "";
  photo.style.height = "";
  photo.style.transform = "";
}

function applyPhotoStyles(photo: HTMLElement, styles: Record<string, string>) {
  Object.entries(styles).forEach(([prop, value]) => {
    if (value) {
      (photo.style as unknown as Record<string, string>)[prop] = value;
    }
  });
}

function showStageControls() {
  document.getElementById("stageControls")?.classList.add("in");
}

function hideStageControls() {
  document.getElementById("stageControls")?.classList.remove("in");
}

class LockInSequenceController {
  private shell: HTMLElement;
  private stage: HTMLElement;
  private hero: HTMLElement;
  private lockInBtn: HTMLElement;

  private lockInRevealed = false;
  private flowToken = 0;
  private isPaused = false;
  private currentCharacterIndex = 0;
  private destroyed = false;

  private pTimer = {
    id: null as number | null,
    callback: null as (() => void) | null,
    remaining: 0,
    startedAt: 0,
    active: false,
  };

  private boundOnPrev: () => void;
  private boundOnNext: () => void;
  private boundOnPause: () => void;
  private boundFitStage: () => void;

  constructor(nodes: {
    shell: HTMLElement;
    stage: HTMLElement;
    hero: HTMLElement;
    lockInBtn: HTMLElement;
  }) {
    this.shell = nodes.shell;
    this.stage = nodes.stage;
    this.hero = nodes.hero;
    this.lockInBtn = nodes.lockInBtn;

    this.boundOnPrev = () => this.navigateCharacter(-1);
    this.boundOnNext = () => this.navigateCharacter(1);
    this.boundOnPause = () => this.togglePause();
    this.boundFitStage = () => this.fitStage();
  }

  public mount() {
    document
      .getElementById("prevBtn")
      ?.addEventListener("click", this.boundOnPrev);
    document
      .getElementById("nextBtn")
      ?.addEventListener("click", this.boundOnNext);
    document
      .getElementById("pauseBtn")
      ?.addEventListener("click", this.boundOnPause);
    window.addEventListener("resize", this.boundFitStage);
    this.fitStage();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.showFinalStateInstantly();
    } else {
      this.runIntroSequence();
    }
  }

  public unmount() {
    this.destroyed = true;
    this.stopAllFlow();
    window.removeEventListener("resize", this.boundFitStage);
    document
      .getElementById("prevBtn")
      ?.removeEventListener("click", this.boundOnPrev);
    document
      .getElementById("nextBtn")
      ?.removeEventListener("click", this.boundOnNext);
    document
      .getElementById("pauseBtn")
      ?.removeEventListener("click", this.boundOnPause);
    this.shell.classList.remove("paused");
  }

  private fitStage() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    this.stage.style.transform = `scale(${scale})`;
  }

  private dropNav() {
    document.querySelectorAll(".li2-nav-item").forEach((el, i) => {
      window.setTimeout(() => {
        el.classList.add("is-dropped");
      }, i * 150);
    });
  }

  private lockInLabelFor(name: string) {
    return `Lock In with @${name}`;
  }

  private applyLockInLabelAnimation(el: HTMLElement, text: string) {
    const startW = this.lockInBtn.offsetWidth;
    this.lockInBtn.style.width = `${startW}px`;
    el.classList.add("is-out");

    const labelEl = el as HTMLElement & { _labelTimer?: number | null };

    labelEl._labelTimer = window.setTimeout(() => {
      el.textContent = text;
      this.lockInBtn.style.width = "auto";
      const endW = this.lockInBtn.offsetWidth;
      this.lockInBtn.style.width = `${startW}px`;

      el.classList.remove("is-out");
      el.classList.add("is-in");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.remove("is-in");
          this.lockInBtn.style.width = `${endW}px`;
          releaseLockInBtnWidth(this.lockInBtn);
        });
      });
      labelEl._labelTimer = null;
    }, LOCK_IN_2_TIMING.lockInLabelMs / 2);
  }

  private updateInstantLabel(
    el: HTMLElement,
    text: string,
    labelEl: HTMLElement & { _labelTimer?: number | null },
  ) {
    if (labelEl._labelTimer) clearTimeout(labelEl._labelTimer);
    labelEl._labelTimer = null;
    el.textContent = text;
    el.classList.remove("is-out", "is-in");
    this.lockInBtn.style.width = "";
  }

  private handleInstantLockInLabel(
    el: HTMLElement,
    text: string,
    labelEl: HTMLElement & { _labelTimer?: number | null },
  ) {
    this.updateInstantLabel(el, text, labelEl);
  }

  private handleAnimatedLockInLabel(
    el: HTMLElement,
    text: string,
    labelEl: HTMLElement & { _labelTimer?: number | null },
  ) {
    if (labelEl._labelTimer) clearTimeout(labelEl._labelTimer);
    this.applyLockInLabelAnimation(el, text);
  }

  private setLockInLabel(text: string, instant?: boolean) {
    const el = document.getElementById("lockInBtnText");
    if (!el) return;

    cancelLockInBtnWidthRelease(this.lockInBtn);
    const labelEl = el as HTMLElement & { _labelTimer?: number | null };

    if (instant || el.textContent === text) {
      this.handleInstantLockInLabel(el, text, labelEl);
    } else {
      this.handleAnimatedLockInLabel(el, text, labelEl);
    }
  }

  private stopAllFlow() {
    this.flowToken += 1;
    if (this.pTimer.id !== null) clearTimeout(this.pTimer.id);
    this.pTimer.id = null;
    this.pTimer.callback = null;
    this.pTimer.active = false;
  }

  private guardFlow(token: number, fn: () => void) {
    return () => {
      if (token !== this.flowToken || this.destroyed) return;
      fn();
    };
  }

  private pSet(callback: () => void, delay: number) {
    this.pTimer.callback = callback;
    this.pTimer.remaining = delay;
    this.pTimer.startedAt = Date.now();
    this.pTimer.active = true;
    this.pTimer.id = window.setTimeout(() => {
      this.pTimer.active = false;
      const cb = this.pTimer.callback;
      this.pTimer.callback = null;
      cb?.();
    }, delay);
  }

  private updatePauseIcon() {
    const btn = document.getElementById("pauseBtn");
    const ids = ["pauseIconPause", "pauseIconPlay"];
    const els = ids.map((id) => document.getElementById(id));
    if (!btn || els.some((e) => !e)) return;

    btn.setAttribute(
      "aria-label",
      this.isPaused ? "Play animation" : "Pause animation",
    );
    els[0]!.classList.toggle("hidden", this.isPaused);
    els[1]!.classList.toggle("hidden", !this.isPaused);
  }

  private pauseTimers() {
    this.shell.classList.add("paused");
    if (this.pTimer.active && this.pTimer.id !== null) {
      clearTimeout(this.pTimer.id);
      this.pTimer.id = null;
      const elapsed = Date.now() - this.pTimer.startedAt;
      this.pTimer.remaining = Math.max(0, this.pTimer.remaining - elapsed);
    }
  }

  private resumeTimers() {
    this.shell.classList.remove("paused");
    if (this.pTimer.active && this.pTimer.callback) {
      this.pSet(this.pTimer.callback, this.pTimer.remaining);
    }
  }

  private togglePause() {
    this.isPaused = !this.isPaused;
    this.updatePauseIcon();
    if (this.isPaused) {
      this.pauseTimers();
    } else {
      this.resumeTimers();
    }
  }

  private resetAchievements() {
    for (let i = 1; i <= 5; i += 1) {
      const ach = document.getElementById(`ach${i}`);
      ach?.classList.remove("in", "active", "passive");
      if (ach) ach.style.display = "flex";
      document.getElementById(`achReaction${i}`)?.classList.remove("active");
    }
  }

  private resetCycle() {
    if (this.isPaused) {
      this.isPaused = false;
      this.shell.classList.remove("paused");
    }
    this.updatePauseIcon();
    hideStageControls();

    const headline = document.getElementById("headline");
    const typed = document.getElementById("typed");
    if (typed) typed.textContent = "";
    headline?.classList.remove("inactive", "gone", "typing", "in");

    document.getElementById("statLine")?.classList.remove("in", "gone");

    this.hero.classList.remove("in");
    resetHeroPalette(this.hero);

    if (!this.lockInRevealed) {
      this.lockInBtn.classList.remove("in");
    }

    document.getElementById("photo")?.classList.remove("in");
    this.resetAchievements();
  }

  private renderAchievements(achievements: { text: string; emoji: string }[]) {
    for (let i = 1; i <= 5; i += 1) {
      const ach = document.getElementById(`ach${i}`);
      const data = achievements[i - 1];
      if (data) {
        ach!.style.display = "flex";
        ach!.querySelector(".achievement-text")!.textContent = data.text;
        setAchievementReaction(
          document.getElementById(`achReaction${i}`),
          data.emoji ?? "",
        );
      } else {
        ach!.style.display = "none";
      }
    }
  }

  private loadPhoto(photo: HTMLImageElement, c: LockIn2Character) {
    photo.src = c.photo;
    photo.alt = c.name;
    resetPhotoStyles(photo);
    applyPhotoStyles(photo, c.photoStyle as unknown as Record<string, string>);

    photo.onload = () => loadHeroPaletteFromPhoto(photo, this.hero);
    const shouldLoadImmediate = photo.complete && photo.naturalWidth;
    if (shouldLoadImmediate) {
      loadHeroPaletteFromPhoto(photo, this.hero);
    }
  }

  private populateCharacter(c: LockIn2Character) {
    const statLine = document.getElementById("statLine");
    if (statLine) {
      statLine.innerHTML = `${c.factPrefix}<span class="stat-highlight font-extrabold text-(--provider-launch-highlight)">${c.factHighlight}</span>${c.factSuffix}`;
    }

    const photo = document.getElementById("photo") as HTMLImageElement;
    if (photo) {
      this.loadPhoto(
        photo,
        c as LockIn2Character & { photoStyle: Record<string, string> },
      );
    }

    this.renderAchievements(c.achievements);
  }

  private finalizeAchievements(
    count: number,
    token: number,
    onComplete?: () => void,
  ) {
    for (let i = 1; i <= count; i++) {
      const el = document.getElementById(`ach${i}`);
      el?.classList.add("active");
      el?.classList.remove("passive");
      document.getElementById(`achReaction${i}`)?.classList.add("active");
    }
    this.pSet(
      this.guardFlow(token, () => onComplete?.()),
      LOCK_IN_2_TIMING.allLitHold,
    );
  }

  private activateCard(index: number) {
    const cardEl = document.getElementById(`ach${index + 1}`);
    show(cardEl);
    cardEl?.classList.add("active");
    document.getElementById(`achReaction${index + 1}`)?.classList.add("active");
  }

  private deactivatePrevCard(index: number) {
    const prev = document.getElementById(`ach${index}`);
    prev?.classList.remove("active");
    prev?.classList.add("passive");
    document.getElementById(`achReaction${index}`)?.classList.remove("active");
  }

  private shouldStopFlow(token: number): boolean {
    return token !== this.flowToken || this.destroyed;
  }

  private stepAchievement(
    index: number,
    count: number,
    token: number,
    onComplete?: () => void,
  ) {
    if (this.shouldStopFlow(token)) return;

    if (index >= count) {
      this.finalizeAchievements(count, token, onComplete);
      return;
    }

    this.activateCard(index);
    if (index > 0) this.deactivatePrevCard(index);

    this.pSet(
      this.guardFlow(token, () =>
        this.stepAchievement(index + 1, count, token, onComplete),
      ),
      LOCK_IN_2_TIMING.achStagger,
    );
  }

  private runAchievements(count: number, onComplete?: () => void) {
    showStageControls();
    this.stepAchievement(0, count, this.flowToken, onComplete);
  }

  private scheduleNextCharacter(fromIndex: number) {
    const token = this.flowToken;
    window.setTimeout(
      this.guardFlow(token, () => {
        this.playCharacter((fromIndex + 1) % LOCK_IN_2_CHARACTERS.length);
      }),
      LOCK_IN_2_TIMING.blankHold,
    );
  }

  private jumpToCharacter(index: number) {
    this.currentCharacterIndex = index;
    const c = LOCK_IN_2_CHARACTERS[index];
    const token = this.flowToken;

    this.resetCycle();
    this.populateCharacter(c);

    document.getElementById("headline")?.classList.add("gone");
    document.getElementById("typed")!.textContent = "";
    document.getElementById("statLine")?.classList.add("gone");

    if (!this.lockInRevealed) {
      this.setLockInLabel(LOCK_IN_2_CONTENT.intro.lockInDefault, true);
      show(this.lockInBtn);
      this.lockInRevealed = true;
    }
    this.setLockInLabel(this.lockInLabelFor(c.name));
    show(this.hero);
    show(document.getElementById("photo"));

    this.runAchievements(
      c.achievements.length,
      this.guardFlow(token, () => {
        this.scheduleNextCharacter(index);
      }),
    );
  }

  private navigateCharacter(delta: number) {
    this.stopAllFlow();
    if (this.isPaused) {
      this.isPaused = false;
      this.shell.classList.remove("paused");
      this.updatePauseIcon();
    }
    const nextIndex =
      (this.currentCharacterIndex + delta + LOCK_IN_2_CHARACTERS.length) %
      LOCK_IN_2_CHARACTERS.length;
    this.jumpToCharacter(nextIndex);
  }

  private proceedCharacterPhases(
    token: number,
    index: number,
    c: LockIn2Character,
  ) {
    const T = LOCK_IN_2_TIMING;
    const headline = document.getElementById("headline");

    window.setTimeout(
      this.guardFlow(token, () => {
        headline?.classList.add("inactive");
        window.setTimeout(
          this.guardFlow(token, () => {
            if (!this.lockInRevealed) {
              this.setLockInLabel(LOCK_IN_2_CONTENT.intro.lockInDefault, true);
              show(this.lockInBtn);
              this.lockInRevealed = true;
            }

            window.setTimeout(
              this.guardFlow(token, () => {
                show(document.getElementById("statLine"));

                window.setTimeout(
                  this.guardFlow(token, () => {
                    headline?.classList.add("gone");
                    document.getElementById("statLine")?.classList.add("gone");

                    window.setTimeout(
                      this.guardFlow(token, () => {
                        window.setTimeout(
                          this.guardFlow(token, () => {
                            window.setTimeout(
                              this.guardFlow(token, () => {
                                show(this.hero);
                                show(document.getElementById("photo"));
                                this.setLockInLabel(
                                  this.lockInLabelFor(c.name),
                                );
                                window.setTimeout(
                                  this.guardFlow(token, () => {
                                    this.runAchievements(
                                      c.achievements.length,
                                      this.guardFlow(token, () => {
                                        this.scheduleNextCharacter(index);
                                      }),
                                    );
                                  }),
                                  T.achStartDelay + T.photoDuration,
                                );
                              }),
                              T.photoDelay,
                            );
                          }),
                          T.relocateDuration,
                        );
                      }),
                      T.clearTextDuration,
                    );
                  }),
                  T.statLineHold,
                );
              }),
              T.pillHold,
            );
          }),
          T.pillDelay,
        );
      }),
      T.holdBold,
    );
  }

  private playCharacter(index: number) {
    this.stopAllFlow();
    const token = this.flowToken;
    const c = LOCK_IN_2_CHARACTERS[index];
    this.currentCharacterIndex = index;

    this.resetCycle();
    this.populateCharacter(c);

    if (this.lockInRevealed) {
      this.setLockInLabel(LOCK_IN_2_CONTENT.intro.lockInDefault);
    }

    const headline = document.getElementById("headline");
    const typed = document.getElementById("typed");

    headline?.classList.add("typing");
    typeText(
      typed!,
      c.headline,
      LOCK_IN_2_TIMING.typeSpeed,
      this.guardFlow(token, () => {
        headline?.classList.remove("typing");
        this.proceedCharacterPhases(token, index, c);
      }),
      token,
      () => this.flowToken,
    );
  }

  private runIntroSequence() {
    const T = LOCK_IN_2_TIMING;
    show(this.stage);
    this.dropNav();

    const banner = document.getElementById("banner");
    const tBanner = T.stageFade + T.bannerDelay;
    window.setTimeout(() => show(banner), tBanner);

    const tWaveDrop = tBanner + T.bannerInDuration + T.waveDropDelay;
    window.setTimeout(
      () => document.getElementById("wave")?.classList.add("dropped"),
      tWaveDrop,
    );

    const tShake = tWaveDrop + T.waveDropDuration + T.shakeDelay;
    window.setTimeout(
      () => document.getElementById("wave")?.classList.add("shake"),
      tShake,
    );

    const tBannerOut = tShake + T.shakeDuration + T.bannerHold;
    window.setTimeout(() => banner?.classList.remove("in"), tBannerOut);

    const tStart = tBannerOut + T.bannerOutDuration + T.pauseAfterBanner;
    window.setTimeout(() => this.playCharacter(0), tStart);
  }

  private showFinalStateInstantly() {
    document
      .querySelectorAll(".li2-nav-item")
      .forEach((el) => el.classList.add("is-dropped"));
    const c = LOCK_IN_2_CHARACTERS[0];
    this.resetCycle();
    this.populateCharacter(c);

    document.getElementById("headline")?.classList.add("gone");
    document.getElementById("statLine")?.classList.add("gone");

    this.setLockInLabel(LOCK_IN_2_CONTENT.intro.lockInDefault, true);
    show(this.lockInBtn);
    this.lockInRevealed = true;
    this.setLockInLabel(this.lockInLabelFor(c.name), true);
    show(this.hero);
    show(document.getElementById("photo"));

    for (let i = 1; i <= c.achievements.length; i += 1) {
      const ach = document.getElementById(`ach${i}`);
      ach?.classList.add("in", "active");
      document.getElementById(`achReaction${i}`)?.classList.add("active");
    }

    showStageControls();
    show(this.stage);
  }
}

export function useLockIn2Sequence() {
  useEffect(() => {
    const shell = document.getElementById("lockIn2Shell");
    const stage = document.getElementById("stage");
    const hero = document.getElementById("hero");
    const lockInBtn = document.getElementById("lockInBtn");

    if ([shell, stage, hero, lockInBtn].some((e) => !e)) {
      return () => {};
    }

    const ctrl = new LockInSequenceController({
      shell: shell as HTMLElement,
      stage: stage as HTMLElement,
      hero: hero as HTMLElement,
      lockInBtn: lockInBtn as HTMLElement,
    });
    ctrl.mount();
    return () => ctrl.unmount();
  }, []);
}
