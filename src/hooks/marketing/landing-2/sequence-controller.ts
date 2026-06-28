import { LANDING_2_SEQUENCE_IDS as IDS } from "@/lib/constants/components/marketing/landing-2-sequence";
import {
  LANDING_2_CHARACTERS,
  LANDING_2_CONTENT,
  LANDING_2_TIMING,
} from "@/lib/marketing/landing-2";
import {
  loadHeroPaletteFromPhoto,
  resetHeroPalette,
} from "@/lib/marketing/landing-2-hero-palette";
import { typeText } from "@/lib/marketing/type-text";
import type { Landing2Character } from "@/lib/types/marketing/landing-2";
import {
  applyPhotoStyles,
  dropLanding2Nav,
  getElement,
  hideStageControls,
  resetPhotoStyles,
  setAchievementReaction,
  showElement,
  showStageControls,
} from "@/hooks/marketing/landing-2/dom-helpers";
import {
  lockInLabelFor,
  setLockInLabel,
} from "@/hooks/marketing/landing-2/lock-in-label";
import { PausedFlowTimer } from "@/hooks/marketing/landing-2/paused-flow-timer";

export class Landing2SequenceController {
  private shell: HTMLElement;
  private stage: HTMLElement;
  private hero: HTMLElement;
  private lockInBtn: HTMLElement;
  private flow = new PausedFlowTimer();
  private timeoutIds = new Set<number>();

  private lockInRevealed = false;
  private isPaused = false;
  private currentCharacterIndex = 0;

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
    getElement(IDS.prevBtn)?.addEventListener("click", this.boundOnPrev);
    getElement(IDS.nextBtn)?.addEventListener("click", this.boundOnNext);
    getElement(IDS.pauseBtn)?.addEventListener("click", this.boundOnPause);
    window.addEventListener("resize", this.boundFitStage);
    this.fitStage();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.showFinalStateInstantly();
    } else {
      this.runIntroSequence();
    }
  }

  public unmount() {
    this.flow.markDestroyed();
    this.flow.stopAll();
    this.clearAllTimeouts();
    window.removeEventListener("resize", this.boundFitStage);
    getElement(IDS.prevBtn)?.removeEventListener("click", this.boundOnPrev);
    getElement(IDS.nextBtn)?.removeEventListener("click", this.boundOnNext);
    getElement(IDS.pauseBtn)?.removeEventListener("click", this.boundOnPause);
    this.shell.classList.remove("paused");
  }

  private fitStage() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    this.stage.style.transform = `scale(${scale})`;
  }

  private scheduleTimeout(callback: () => void, delay: number) {
    const id = window.setTimeout(() => {
      this.timeoutIds.delete(id);
      if (this.flow.isDestroyed()) return;
      callback();
    }, delay);
    this.timeoutIds.add(id);
    return id;
  }

  private clearAllTimeouts() {
    for (const id of this.timeoutIds) {
      clearTimeout(id);
    }
    this.timeoutIds.clear();
  }

  private revealLockInCta(defaultInstant = true) {
    if (this.lockInRevealed) return;

    setLockInLabel(
      this.lockInBtn,
      LANDING_2_CONTENT.intro.lockInDefault,
      defaultInstant,
    );
    showElement(this.lockInBtn);
    this.lockInRevealed = true;
  }

  private updatePauseIcon() {
    const btn = getElement(IDS.pauseBtn);
    const pauseIcon = getElement(IDS.pauseIconPause);
    const playIcon = getElement(IDS.pauseIconPlay);
    if (!btn || !pauseIcon || !playIcon) return;

    btn.setAttribute(
      "aria-label",
      this.isPaused ? "Play animation" : "Pause animation",
    );
    pauseIcon.classList.toggle("hidden", this.isPaused);
    playIcon.classList.toggle("hidden", !this.isPaused);
  }

  private pauseTimers() {
    this.shell.classList.add("paused");
    this.flow.pause();
  }

  private resumeTimers() {
    this.shell.classList.remove("paused");
    this.flow.resume();
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
    getElement(IDS.influencerBadge)?.classList.remove("in");
    const badgeLabel = getElement(IDS.influencerBadge)?.querySelector(
      ".l2-influencer-badge-label",
    );
    if (badgeLabel) badgeLabel.textContent = "";

    for (let i = 1; i <= 5; i += 1) {
      const ach = getElement(IDS.achievement(i));
      ach?.classList.remove("in", "active", "passive");
      if (ach) ach.style.display = "flex";
      getElement(IDS.achievementReaction(i))?.classList.remove(
        "active",
        "shake",
      );
    }
  }

  private setInfluencerBadgeLabel(name: string) {
    const label = getElement(IDS.influencerBadge)?.querySelector(
      ".l2-influencer-badge-label",
    );
    if (label) label.textContent = `@${name}`;
  }

  private renderAchievements(achievements: Landing2Character["achievements"]) {
    for (let i = 1; i <= 5; i += 1) {
      const ach = getElement(IDS.achievement(i));
      const data = achievements[i - 1];
      if (!ach) continue;

      if (data) {
        ach.style.display = "flex";
        ach.querySelector(".achievement-text")!.textContent = data.text;
        setAchievementReaction(
          getElement(IDS.achievementReaction(i)),
          data.emoji,
        );
      } else {
        ach.style.display = "none";
      }
    }
  }

  private resetCycle() {
    if (this.isPaused) {
      this.isPaused = false;
      this.shell.classList.remove("paused");
    }
    this.updatePauseIcon();
    hideStageControls();

    const headline = getElement(IDS.headline);
    const typed = getElement(IDS.typed);
    if (typed) typed.textContent = "";
    headline?.classList.remove("inactive", "gone", "typing", "in");

    getElement(IDS.statLine)?.classList.remove("in", "gone");

    this.hero.classList.remove("in");
    resetHeroPalette(this.hero);

    if (!this.lockInRevealed) {
      this.lockInBtn.classList.remove("in");
    }

    getElement(IDS.photo)?.classList.remove("in");
    this.resetAchievements();
  }

  private loadPhoto(photo: HTMLImageElement, character: Landing2Character) {
    photo.src = character.photo;
    photo.alt = character.name;
    resetPhotoStyles(photo);
    applyPhotoStyles(
      photo,
      character.photoStyle as unknown as Record<string, string>,
    );

    photo.onload = () => loadHeroPaletteFromPhoto(photo, this.hero);
    if (photo.complete && photo.naturalWidth) {
      loadHeroPaletteFromPhoto(photo, this.hero);
    }
  }

  private populateCharacter(character: Landing2Character) {
    const statLine = getElement(IDS.statLine);
    if (statLine) {
      statLine.innerHTML = `${character.factPrefix}<span class="stat-highlight text-landing-2-highlight font-extrabold">${character.factHighlight}</span>${character.factSuffix}`;
    }

    const photo = getElement<HTMLImageElement>(IDS.photo);
    if (photo) this.loadPhoto(photo, character);

    this.setInfluencerBadgeLabel(character.name);
    this.renderAchievements(character.achievements);
  }

  private finalizeAchievements(
    count: number,
    token: number,
    onComplete?: () => void,
  ) {
    for (let i = 1; i <= count; i += 1) {
      getElement(IDS.achievement(i))?.classList.add("active");
      getElement(IDS.achievement(i))?.classList.remove("passive");
      getElement(IDS.achievementReaction(i))?.classList.add("active");
    }

    this.flow.schedule(
      this.flow.guard(token, () => onComplete?.()),
      LANDING_2_TIMING.allLitHold,
    );
  }

  private triggerEmojiShake(reaction: HTMLElement | null) {
    if (!reaction) return;
    reaction.classList.remove("shake");
    void reaction.offsetWidth;
    reaction.classList.add("shake");
  }

  private activateCard(index: number) {
    const cardEl = getElement(IDS.achievement(index + 1));
    showElement(cardEl);
    cardEl?.classList.add("active");
    const reaction = getElement(IDS.achievementReaction(index + 1));
    reaction?.classList.add("active");
    this.triggerEmojiShake(reaction);
  }

  private deactivatePrevCard(index: number) {
    const prev = getElement(IDS.achievement(index));
    prev?.classList.remove("active");
    prev?.classList.add("passive");
    const reaction = getElement(IDS.achievementReaction(index));
    reaction?.classList.remove("active", "shake");
  }

  private stepAchievement(
    index: number,
    count: number,
    token: number,
    onComplete?: () => void,
  ) {
    if (token !== this.flow.getFlowToken() || this.flow.isDestroyed()) return;

    if (index >= count) {
      this.finalizeAchievements(count, token, onComplete);
      return;
    }

    this.activateCard(index);
    if (index > 0) this.deactivatePrevCard(index);

    this.flow.schedule(
      this.flow.guard(token, () =>
        this.stepAchievement(index + 1, count, token, onComplete),
      ),
      LANDING_2_TIMING.achStagger,
    );
  }

  private runAchievements(count: number, onComplete?: () => void) {
    showElement(getElement(IDS.influencerBadge));
    showStageControls();
    this.stepAchievement(0, count, this.flow.getFlowToken(), onComplete);
  }

  private scheduleNextCharacter(fromIndex: number) {
    const token = this.flow.getFlowToken();
    this.scheduleTimeout(
      this.flow.guard(token, () => {
        this.playCharacter((fromIndex + 1) % LANDING_2_CHARACTERS.length);
      }),
      LANDING_2_TIMING.blankHold,
    );
  }

  private jumpToCharacter(index: number) {
    this.currentCharacterIndex = index;
    const character = LANDING_2_CHARACTERS[index];

    this.resetCycle();
    this.populateCharacter(character);

    getElement(IDS.headline)?.classList.add("gone");
    const typed = getElement(IDS.typed);
    if (typed) typed.textContent = "";
    getElement(IDS.statLine)?.classList.add("gone");

    this.revealLockInCta(true);
    setLockInLabel(this.lockInBtn, lockInLabelFor(character.name));
    showElement(this.hero);
    showElement(getElement(IDS.photo));

    this.runAchievements(character.achievements.length, () => {
      this.scheduleNextCharacter(index);
    });
  }

  private navigateCharacter(delta: number) {
    this.flow.stopAll();
    this.clearAllTimeouts();
    if (this.isPaused) {
      this.isPaused = false;
      this.shell.classList.remove("paused");
      this.updatePauseIcon();
    }

    const nextIndex =
      (this.currentCharacterIndex + delta + LANDING_2_CHARACTERS.length) %
      LANDING_2_CHARACTERS.length;
    this.jumpToCharacter(nextIndex);
  }

  private proceedCharacterPhases(
    token: number,
    index: number,
    character: Landing2Character,
  ) {
    const timing = LANDING_2_TIMING;
    const headline = getElement(IDS.headline);

    this.scheduleTimeout(
      this.flow.guard(token, () => {
        headline?.classList.add("inactive");
        this.scheduleTimeout(
          this.flow.guard(token, () => {
            this.revealLockInCta(true);

            this.scheduleTimeout(
              this.flow.guard(token, () => {
                showElement(getElement(IDS.statLine));

                this.scheduleTimeout(
                  this.flow.guard(token, () => {
                    headline?.classList.add("gone");
                    getElement(IDS.statLine)?.classList.add("gone");

                    this.scheduleTimeout(
                      this.flow.guard(token, () => {
                        this.scheduleTimeout(
                          this.flow.guard(token, () => {
                            this.scheduleTimeout(
                              this.flow.guard(token, () => {
                                showElement(this.hero);
                                showElement(getElement(IDS.photo));
                                setLockInLabel(
                                  this.lockInBtn,
                                  lockInLabelFor(character.name),
                                );
                                this.scheduleTimeout(
                                  this.flow.guard(token, () => {
                                    this.runAchievements(
                                      character.achievements.length,
                                      () => this.scheduleNextCharacter(index),
                                    );
                                  }),
                                  timing.achStartDelay + timing.photoDuration,
                                );
                              }),
                              timing.photoDelay,
                            );
                          }),
                          timing.relocateDuration,
                        );
                      }),
                      timing.clearTextDuration,
                    );
                  }),
                  timing.statLineHold,
                );
              }),
              timing.pillHold,
            );
          }),
          timing.pillDelay,
        );
      }),
      timing.holdBold,
    );
  }

  private playCharacter(index: number) {
    const token = this.flow.stopAll();
    this.clearAllTimeouts();
    const character = LANDING_2_CHARACTERS[index];
    this.currentCharacterIndex = index;

    this.resetCycle();
    this.populateCharacter(character);

    if (this.lockInRevealed) {
      setLockInLabel(this.lockInBtn, LANDING_2_CONTENT.intro.lockInDefault);
    }

    const headline = getElement(IDS.headline);
    const typed = getElement(IDS.typed);
    if (!typed || this.flow.isDestroyed()) return;

    headline?.classList.add("typing");
    typeText(
      typed,
      character.headline,
      LANDING_2_TIMING.typeSpeed,
      this.flow.guard(token, () => {
        headline?.classList.remove("typing");
        this.proceedCharacterPhases(token, index, character);
      }),
      token,
      () => this.flow.getFlowToken(),
    );
  }

  private runIntroSequence() {
    const timing = LANDING_2_TIMING;
    showElement(this.stage);
    dropLanding2Nav();

    const banner = getElement(IDS.banner);
    const bannerRevealAt = timing.stageFade + timing.bannerDelay;
    this.scheduleTimeout(() => showElement(banner), bannerRevealAt);

    const waveDropAt =
      bannerRevealAt + timing.bannerInDuration + timing.waveDropDelay;
    this.scheduleTimeout(
      () => getElement(IDS.wave)?.classList.add("dropped"),
      waveDropAt,
    );

    const waveShakeAt =
      waveDropAt + timing.waveDropDuration + timing.shakeDelay;
    this.scheduleTimeout(
      () => getElement(IDS.wave)?.classList.add("shake"),
      waveShakeAt,
    );

    const bannerHideAt = waveShakeAt + timing.shakeDuration + timing.bannerHold;
    this.scheduleTimeout(() => banner?.classList.remove("in"), bannerHideAt);

    const startCharacterAt =
      bannerHideAt + timing.bannerOutDuration + timing.pauseAfterBanner;
    this.scheduleTimeout(() => this.playCharacter(0), startCharacterAt);
  }

  private showFinalStateInstantly() {
    dropLanding2Nav(true);
    const character = LANDING_2_CHARACTERS[0];
    this.resetCycle();
    this.populateCharacter(character);

    getElement(IDS.headline)?.classList.add("gone");
    getElement(IDS.statLine)?.classList.add("gone");

    this.revealLockInCta(true);
    setLockInLabel(this.lockInBtn, lockInLabelFor(character.name), true);
    showElement(this.hero);
    showElement(getElement(IDS.photo));

    showElement(getElement(IDS.influencerBadge));

    for (let i = 1; i <= character.achievements.length; i += 1) {
      const ach = getElement(IDS.achievement(i));
      ach?.classList.add("in", "active");
      getElement(IDS.achievementReaction(i))?.classList.add("active");
    }

    showStageControls();
    showElement(this.stage);
  }
}
