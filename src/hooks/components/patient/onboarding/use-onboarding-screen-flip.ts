"use client";

import { useEffect, useRef, useState } from "react";
import { ONBOARDING_SCREENS } from "@/lib/constants/components/patient/onboarding";
import type { OnboardingScreen } from "@/lib/types/components/patient/onboarding";

const EDUCATION_SCREENS: ReadonlySet<OnboardingScreen> = new Set([
  ONBOARDING_SCREENS.SCHOOL_TYPE,
  ONBOARDING_SCREENS.PROGRAMME,
  ONBOARDING_SCREENS.GRADE,
]);

const FLIP_EXIT_MS = 380;
const FLIP_ENTER_MS = 400;

function shouldFlipBetweenScreens(
  previous: OnboardingScreen,
  next: OnboardingScreen,
): boolean {
  if (!EDUCATION_SCREENS.has(next)) {
    return false;
  }

  return (
    EDUCATION_SCREENS.has(previous) ||
    previous === ONBOARDING_SCREENS.PROFILE_PHOTO
  );
}

export function useOnboardingScreenFlip(screen: OnboardingScreen) {
  const previousScreenRef = useRef(screen);
  const [displayScreen, setDisplayScreen] = useState(screen);
  const [screenClassName, setScreenClassName] = useState<string | undefined>();

  useEffect(() => {
    const previous = previousScreenRef.current;
    if (previous === screen) {
      return;
    }

    const shouldFlip = shouldFlipBetweenScreens(previous, screen);
    previousScreenRef.current = screen;

    if (!shouldFlip) {
      setDisplayScreen(screen);
      setScreenClassName(undefined);
      return;
    }

    setScreenClassName("flip-exit");
    const exitTimer = window.setTimeout(() => {
      setDisplayScreen(screen);
      setScreenClassName("flip-enter");
      const enterTimer = window.setTimeout(() => {
        setScreenClassName(undefined);
      }, FLIP_ENTER_MS);
      return () => window.clearTimeout(enterTimer);
    }, FLIP_EXIT_MS);

    return () => window.clearTimeout(exitTimer);
  }, [screen]);

  return { displayScreen, screenClassName };
}
