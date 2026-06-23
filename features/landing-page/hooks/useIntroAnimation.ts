"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CHARACTERS,
  T,
  type Character,
} from "@/features/landing-page/data/characters";

// ─── shape of every piece of UI state ────────────────────────────────────────
export interface IntroState {
  stageVisible: boolean;

  // top bar
  pledgeIn: boolean;
  logoIn: boolean;
  providersIn: boolean;

  // banner
  bannerIn: boolean;
  waveDropped: boolean;
  waveShake: boolean;

  // headline
  typedText: string;
  headlineTyping: boolean;
  headlineInactive: boolean;
  headlineGone: boolean;

  // meet pill
  meetPillIn: boolean;
  meetPillRelocate: boolean;
  meetEmojiShake: boolean;
  meetText: string;
  meetTextVisible: boolean;
  meetEmoji: string;

  // stat line
  statLineIn: boolean;
  statLineGone: boolean;
  statPrefix: string;
  statHighlight: string;
  statSuffix: string;

  // photo
  photoIn: boolean;
  photoSrc: string;
  photoAlt: string;
  photoStyle: React.CSSProperties;

  // achievements (up to 5 slots)
  achievements: {
    text: string;
    emoji: string;
    in: boolean;
    active: boolean;
    pillShake: boolean;
    emojiShake: boolean;
  }[];

  // pause button
  pauseBtnIn: boolean;
  isPaused: boolean;
}

const BLANK_ACH = {
  text: "",
  emoji: "",
  in: false,
  active: false,
  pillShake: false,
  emojiShake: false,
};

function makeInitialState(): IntroState {
  return {
    stageVisible: false,
    pledgeIn: false,
    logoIn: false,
    providersIn: false,
    bannerIn: false,
    waveDropped: false,
    waveShake: false,
    typedText: "",
    headlineTyping: false,
    headlineInactive: false,
    headlineGone: false,
    meetPillIn: false,
    meetPillRelocate: false,
    meetEmojiShake: false,
    meetText: "Meet @Setornam",
    meetTextVisible: true,
    meetEmoji: "🧑‍💻",
    statLineIn: false,
    statLineGone: false,
    statPrefix: "",
    statHighlight: "",
    statSuffix: "",
    photoIn: false,
    photoSrc: "",
    photoAlt: "",
    photoStyle: {},
    achievements: Array.from({ length: 5 }, () => ({ ...BLANK_ACH })),
    pauseBtnIn: false,
    isPaused: false,
  };
}

export function useIntroAnimation() {
  const [state, setState] = useState<IntroState>(makeInitialState);

  // ─── refs that survive re-renders without triggering them ─────────────────
  const isPausedRef = useRef(false);
  const pillCycleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentNameRef = useRef("");

  // pausable single-slot timer
  const pTimer = useRef<{
    id: ReturnType<typeof setTimeout> | null;
    callback: (() => void) | null;
    remaining: number;
    startedAt: number;
    active: boolean;
  }>({ id: null, callback: null, remaining: 0, startedAt: 0, active: false });

  // plain timeouts we fire-and-forget (not pausable — only used before achievements)
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const typeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── helpers ──────────────────────────────────────────────────────────────
  const patch = useCallback(
    (
      partial:
        | Partial<IntroState>
        | ((prev: IntroState) => Partial<IntroState>),
    ) => {
      setState((prev) => {
        const updates = typeof partial === "function" ? partial(prev) : partial;
        return { ...prev, ...updates };
      });
    },
    [],
  );

  const patchAch = useCallback(
    (index: number, updates: Partial<IntroState["achievements"][0]>) => {
      setState((prev) => {
        const achievements = prev.achievements.map((a, i) =>
          i === index ? { ...a, ...updates } : a,
        );
        return { ...prev, achievements };
      });
    },
    [],
  );

  const after = useCallback((ms: number, fn: () => void) => {
    const id = setTimeout(fn, ms);
    timeouts.current.push(id);
    return id;
  }, []);

  // ─── pausable timer ────────────────────────────────────────────────────────
  const pSet = useCallback((callback: () => void, delay: number) => {
    if (pTimer.current.id !== null) clearTimeout(pTimer.current.id);
    pTimer.current.callback = callback;
    pTimer.current.remaining = delay;
    pTimer.current.startedAt = Date.now();
    pTimer.current.active = true;
    pTimer.current.id = setTimeout(() => {
      pTimer.current.active = false;
      const cb = pTimer.current.callback;
      pTimer.current.callback = null;
      if (cb) cb();
    }, delay);
  }, []);

  // ─── pill text cycle ───────────────────────────────────────────────────────
  const startPillCycle = useCallback(
    (name: string) => {
      const texts = [
        `Meet @${name}`,
        `Lock In with @${name}`,
        "Click to Lock In now",
      ];
      let idx = 0;
      patch({ meetText: texts[0], meetTextVisible: true });

      pillCycleRef.current = setInterval(() => {
        // 1. fade the text out (opacity → 0), but keep the string so width stays stable
        patch({ meetTextVisible: false });
        setTimeout(() => {
          // 2. swap the text while it's invisible
          idx = (idx + 1) % texts.length;
          patch({ meetText: texts[idx] });
          // 3. fade back in
          setTimeout(() => patch({ meetTextVisible: true }), 20);
        }, 220);
      }, T.pillTextCycle);
    },
    [patch],
  );

  const stopPillCycle = useCallback(() => {
    if (pillCycleRef.current) {
      clearInterval(pillCycleRef.current);
      pillCycleRef.current = null;
    }
  }, []);

  // ─── typewriter ───────────────────────────────────────────────────────────
  const typeText = useCallback(
    (text: string, speed: number, onDone: () => void) => {
      let i = 0;
      const accumulated: string[] = [];
      function step() {
        if (i < text.length) {
          accumulated.push(text.charAt(i));
          patch({ typedText: accumulated.join("") });
          i++;
          typeTimer.current = setTimeout(step, speed);
        } else {
          onDone();
        }
      }
      step();
    },
    [patch],
  );

  // ─── achievement cascade ──────────────────────────────────────────────────
  const runAchievements = useCallback(
    (count: number, onComplete: () => void) => {
      patch({ pauseBtnIn: true });

      function step(index: number) {
        if (index >= count) {
          // light all together
          setState((prev) => ({
            ...prev,
            achievements: prev.achievements.map((a, i) =>
              i < count ? { ...a, active: true } : a,
            ),
          }));
          pSet(() => {
            patch({ pauseBtnIn: false });
            onComplete();
          }, T.allLitHold);
          return;
        }

        // show this achievement
        patchAch(index, {
          in: true,
          active: true,
          pillShake: true,
          emojiShake: true,
        });

        // deactivate the previous one
        if (index > 0) {
          patchAch(index - 1, { active: false });
        }

        pSet(() => step(index + 1), T.achStagger);
      }

      step(0);
    },
    [patch, patchAch, pSet],
  );

  // ─── single character play ────────────────────────────────────────────────
  const playCharacter = useCallback(
    (charIndex: number) => {
      const c: Character = CHARACTERS[charIndex];
      currentNameRef.current = c.name;

      // reset all cycle-level state
      stopPillCycle();
      if (pTimer.current.id) clearTimeout(pTimer.current.id);
      pTimer.current = {
        id: null,
        callback: null,
        remaining: 0,
        startedAt: 0,
        active: false,
      };

      setState((prev) => ({
        ...prev,
        typedText: "",
        headlineTyping: false,
        headlineInactive: false,
        headlineGone: false,
        meetPillIn: false,
        meetPillRelocate: false,
        meetEmojiShake: false,
        meetText: `Meet @${c.name}`,
        meetTextVisible: true,
        meetEmoji: c.pillEmoji,
        statLineIn: false,
        statLineGone: false,
        statPrefix: c.factPrefix,
        statHighlight: c.factHighlight,
        statSuffix: c.factSuffix,
        photoIn: false,
        photoSrc: c.photoSrc,
        photoAlt: c.name,
        photoStyle: c.photoStyle,
        achievements: Array.from({ length: 5 }, (_, i) => {
          const d = c.achievements[i];
          return d
            ? {
                text: d.text,
                emoji: d.emoji,
                in: false,
                active: false,
                pillShake: false,
                emojiShake: false,
              }
            : { ...BLANK_ACH };
        }),
        pauseBtnIn: false,
        isPaused: false,
      }));
      isPausedRef.current = false;

      // small tick so state flushes before animation starts
      setTimeout(() => {
        patch({ headlineTyping: true });

        typeText(c.headline, T.typeSpeed, () => {
          patch({ headlineTyping: false });

          after(T.holdBold, () => {
            patch({ headlineInactive: true });

            after(T.pillDelay, () => {
              patch({ meetPillIn: true });
              startPillCycle(c.name);

              after(T.meetShakeDelay, () => patch({ meetEmojiShake: true }));

              after(T.pillHold, () => {
                patch({ statLineIn: true });

                after(T.statLineHold, () => {
                  patch({ headlineGone: true, statLineGone: true });

                  after(T.clearTextDuration, () => {
                    patch({ meetPillRelocate: true });

                    after(T.relocateDuration + T.photoDelay, () => {
                      patch({ photoIn: true });

                      after(T.photoDuration + T.achStartDelay, () => {
                        runAchievements(c.achievements.length, () => {
                          after(T.blankHold, () => {
                            playCharacter((charIndex + 1) % CHARACTERS.length);
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }, 0);
    },
    [after, patch, startPillCycle, stopPillCycle, typeText, runAchievements],
  );

  // ─── pause / resume ───────────────────────────────────────────────────────
  const togglePause = useCallback(() => {
    isPausedRef.current = !isPausedRef.current;
    const paused = isPausedRef.current;
    patch({ isPaused: paused });

    if (paused) {
      stopPillCycle();
      if (pTimer.current.active && pTimer.current.id !== null) {
        clearTimeout(pTimer.current.id);
        pTimer.current.id = null;
        const elapsed = Date.now() - pTimer.current.startedAt;
        pTimer.current.remaining = Math.max(
          0,
          pTimer.current.remaining - elapsed,
        );
      }
    } else {
      startPillCycle(currentNameRef.current);
      if (pTimer.current.active && pTimer.current.callback) {
        pSet(pTimer.current.callback, pTimer.current.remaining);
      }
    }
  }, [patch, startPillCycle, stopPillCycle, pSet]);

  // ─── entry point ─────────────────────────────────────────────────────────
  useEffect(() => {
    // stage fade in
    after(50, () => patch({ stageVisible: true }));

    after(T.stageFade, () => {
      patch({ pledgeIn: true, logoIn: true, providersIn: true });
    });

    const tBanner = T.stageFade + T.bannerDelay;
    after(tBanner, () => patch({ bannerIn: true }));

    const tWaveDrop = tBanner + T.bannerInDuration + T.waveDropDelay;
    after(tWaveDrop, () => patch({ waveDropped: true }));

    const tShake = tWaveDrop + T.waveDropDuration + T.shakeDelay;
    after(tShake, () => patch({ waveShake: true }));

    const tBannerOut = tShake + T.shakeDuration + T.bannerHold;
    after(tBannerOut, () => patch({ bannerIn: false }));

    const tStart = tBannerOut + T.bannerOutDuration + T.pauseAfterBanner;
    after(tStart, () => playCharacter(0));

    return () => {
      timeouts.current.forEach(clearTimeout);
      if (typeTimer.current) clearTimeout(typeTimer.current);
      if (pTimer.current.id) clearTimeout(pTimer.current.id);
      stopPillCycle();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { state, togglePause };
}
