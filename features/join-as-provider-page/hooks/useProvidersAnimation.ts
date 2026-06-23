"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ROLES,
  CARDS,
  LINE_1,
  LINE_2,
  T,
} from "@/features/join-as-provider-page/data/providers";
import {
  parseMarkup,
  typeIntoEl,
  typeIntoElTimed,
  disintegrate,
  renderInstant,
} from "@/features/join-as-provider-page/lib/richText";

// ─── UI state shape ───────────────────────────────────────────────────────────
export interface ProvidersState {
  // nav
  navItemsIn: boolean[]; // [logo, link, cta]

  // header
  headerIn: boolean;
  currentRole: string;
  roleVisible: boolean; // false → opacity 0, for the swap
  waveDropped: boolean;
  waveShaking: boolean;

  // cards
  cardsVisible: boolean;
  pills: boolean[]; // pill[i].in
  bubbles: boolean[]; // bubble[i].in

  // closing
  closingVisible: boolean;
  close1In: boolean;
  close2In: boolean;

  // lock-in
  lockinVisible: boolean;
  lockinIn: boolean;
}

function makeInitial(): ProvidersState {
  return {
    navItemsIn: [false, false, false],
    headerIn: false,
    currentRole: ROLES[0],
    roleVisible: true,
    waveDropped: false,
    waveShaking: false,
    cardsVisible: false,
    pills: [false, false, false],
    bubbles: [false, false, false],
    closingVisible: false,
    close1In: false,
    close2In: false,
    lockinVisible: false,
    lockinIn: false,
  };
}

export function useProvidersAnimation(
  bodyCopyRef: React.RefObject<HTMLDivElement | null>,
  bubbleRefs: React.RefObject<HTMLParagraphElement | null>[],
  applyScale: () => void,
) {
  const [state, setState] = useState<ProvidersState>(makeInitial);

  const roleIndexRef = useRef(0);
  const roleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelTypeRef = useRef<(() => void) | null>(null);

  // ─── patch helper ─────────────────────────────────────────────────────────
  const patch = useCallback(
    (
      partial:
        | Partial<ProvidersState>
        | ((p: ProvidersState) => Partial<ProvidersState>),
    ) => {
      setState((prev) => {
        const updates = typeof partial === "function" ? partial(prev) : partial;
        return { ...prev, ...updates };
      });
    },
    [],
  );

  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  // ─── role cycling ─────────────────────────────────────────────────────────
  const startRoleCycle = useCallback(() => {
    if (roleTimerRef.current) clearInterval(roleTimerRef.current);
    roleTimerRef.current = setInterval(() => {
      // fade out
      patch({ roleVisible: false });
      setTimeout(() => {
        roleIndexRef.current = (roleIndexRef.current + 1) % ROLES.length;
        patch({
          currentRole: ROLES[roleIndexRef.current],
          roleVisible: true,
          waveShaking: false,
        });
        // re-trigger shake
        requestAnimationFrame(() => {
          requestAnimationFrame(() => patch({ waveShaking: true }));
        });
      }, 420);
    }, T.roleCycleInterval);
  }, [patch]);

  // ─── type into body copy ──────────────────────────────────────────────────
  const typeLine = useCallback(
    (markup: string, speed: number): Promise<void> => {
      return new Promise((resolve) => {
        if (!bodyCopyRef.current) {
          resolve();
          return;
        }
        cancelTypeRef.current?.();
        cancelTypeRef.current = typeIntoEl(
          bodyCopyRef.current,
          parseMarkup(markup),
          speed,
          resolve,
        );
      });
    },
    [bodyCopyRef],
  );

  // ─── reveal one card ──────────────────────────────────────────────────────
  const revealCard = useCallback(
    async (index: number) => {
      // show pill
      patch((prev) => {
        const pills = [...prev.pills];
        pills[index] = true;
        return { pills };
      });
      await wait(T.cardPillHold);

      // show bubble container
      patch((prev) => {
        const bubbles = [...prev.bubbles];
        bubbles[index] = true;
        return { bubbles };
      });
      await wait(T.bubbleFadeDelay);

      // type into bubble DOM node directly
      await new Promise<void>((resolve) => {
        const el = bubbleRefs[index]?.current;
        if (!el) {
          resolve();
          return;
        }
        cancelTypeRef.current?.();
        cancelTypeRef.current = typeIntoElTimed(
          el,
          parseMarkup(CARDS[index].bubbleText),
          T.bubbleTypeDuration,
          resolve,
        );
      });
    },
    [patch, bubbleRefs],
  );

  // ─── full animation sequence ──────────────────────────────────────────────
  const runSequence = useCallback(async () => {
    // nav drops in staggered
    for (let i = 0; i < 3; i++) {
      await wait(i === 0 ? 0 : 150);
      patch((prev) => {
        const n = [...prev.navItemsIn];
        n[i] = true;
        return { navItemsIn: n };
      });
    }
    await wait(T.navDone);

    // header appears
    patch({ headerIn: true });
    await wait(T.headerFadeIn);

    // wave drops then shakes
    patch({ waveDropped: true });
    await wait(T.waveDrop);
    patch({ waveShaking: true });
    await wait(T.waveHold);

    // role cycle starts
    await wait(T.roleStartDelay);
    startRoleCycle();

    // line 1 — type → hold → disintegrate
    await typeLine(LINE_1, T.typeSpeed);
    await wait(T.line1Hold);
    if (bodyCopyRef.current) {
      await disintegrate(bodyCopyRef.current, LINE_1, T.disintegrateDuration);
      bodyCopyRef.current.innerHTML = "";
    }
    await wait(T.betweenLines);

    // line 2 — type → hold → disintegrate
    await typeLine(LINE_2, T.typeSpeed);
    await wait(T.line2Hold);
    if (bodyCopyRef.current) {
      await disintegrate(bodyCopyRef.current, LINE_2, T.disintegrateDuration);
      bodyCopyRef.current.innerHTML = "";
    }
    await wait(T.betweenLines);

    // show cards grid
    patch({ cardsVisible: true });
    applyScale();
    await wait(50);

    // each card in sequence
    for (let i = 0; i < CARDS.length; i++) {
      await revealCard(i);
      if (i < CARDS.length - 1) await wait(T.betweenCards);
    }
    await wait(T.lastCardHold);

    // closing lines
    patch({ closingVisible: true });
    applyScale();
    await wait(50);
    patch({ close1In: true });
    await wait(T.closeLineStagger);
    patch({ close2In: true });
    await wait(T.closeLineStagger);

    // lock-in button
    patch({ lockinVisible: true });
    applyScale();
    await wait(50);
    patch({ lockinIn: true });
  }, [startRoleCycle, typeLine, revealCard, patch, applyScale, bodyCopyRef]);

  // ─── reduced-motion shortcut ──────────────────────────────────────────────
  const showInstantly = useCallback(() => {
    patch({
      navItemsIn: [true, true, true],
      headerIn: true,
      currentRole: ROLES[0],
      roleVisible: true,
      waveDropped: true,
      waveShaking: false,
      cardsVisible: true,
      pills: [true, true, true],
      bubbles: [true, true, true],
      closingVisible: true,
      close1In: true,
      close2In: true,
      lockinVisible: true,
      lockinIn: true,
    });
    CARDS.forEach((card, i) => {
      const el = bubbleRefs[i]?.current;
      if (el) renderInstant(el, card.bubbleText);
    });
    applyScale();
  }, [patch, bubbleRefs, applyScale]);

  // ─── bootstrap ────────────────────────────────────────────────────────────
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      showInstantly();
    } else {
      runSequence();
    }

    return () => {
      if (roleTimerRef.current) clearInterval(roleTimerRef.current);
      cancelTypeRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { state };
}
