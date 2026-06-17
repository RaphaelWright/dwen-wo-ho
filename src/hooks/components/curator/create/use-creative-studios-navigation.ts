"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { DYNAMIC_ROUTES, ROUTES } from "@/lib/constants/routes";
import { CREATIVE_STUDIOS_STEP_BOUNDS } from "@/lib/constants/components/curator/create/creative-studios";
import type {
  CreativeStudiosStep,
  CreativeStudiosType,
} from "@/lib/types/components/curator/create/creative-studios";

const BACK_MAP: Record<
  CreativeStudiosType,
  Record<CreativeStudiosStep, number | "dashboard">
> = {
  campus: { 1: "dashboard", 2: 1 },
  provider: { 1: "dashboard", 2: 1 },
  programme: { 1: "dashboard", 2: 1 },
  tag: { 1: "dashboard", 2: "dashboard" },
};

export function useCreativeStudiosNavigation(type: CreativeStudiosType) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bounds = CREATIVE_STUDIOS_STEP_BOUNDS[type];

  const step = useMemo((): CreativeStudiosStep => {
    const raw = Number(searchParams.get("step") ?? "1");
    if (raw === 2 && bounds.max >= 2) return 2;
    return 1;
  }, [searchParams, bounds.max]);

  const goToStep = useCallback(
    (nextStep: number) => {
      router.push(DYNAMIC_ROUTES.curator.createFlow(type, nextStep) as Route);
    },
    [router, type],
  );

  const goNext = useCallback(() => {
    if (step < bounds.max) {
      goToStep(step + 1);
    }
  }, [step, bounds.max, goToStep]);

  const goBack = useCallback(() => {
    const target = BACK_MAP[type][step];
    if (target === "dashboard") {
      router.push(ROUTES.curator.create as Route);
      return;
    }
    goToStep(target);
  }, [type, step, router, goToStep]);

  return { step, goNext, goBack, goToStep };
}
