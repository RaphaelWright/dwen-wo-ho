"use client";

import { useEffect } from "react";
import type { Route } from "next";
import { notFound, useRouter } from "next/navigation";
import { CampusStep1 } from "@/components/curator/create/creative-studios/campus/step-1";
import { CampusStep2 } from "@/components/curator/create/creative-studios/campus/step-2";
import { ProgrammeStep1 } from "@/components/curator/create/creative-studios/programme/step-1";
import { ProgrammeStep2 } from "@/components/curator/create/creative-studios/programme/step-2";
import { ProviderStep1 } from "@/components/curator/create/creative-studios/provider/step-1";
import { ProviderStep2 } from "@/components/curator/create/creative-studios/provider/step-2";
import { TagForm } from "@/components/curator/create/creative-studios/tag/form";
import { CREATIVE_STUDIOS_STEP_BOUNDS } from "@/lib/constants/components/curator/create/creative-studios";
import { DYNAMIC_ROUTES } from "@/lib/constants/routes";
import { isCreativeStudiosType } from "@/lib/utils/curator/create/is-creative-studios-type";
import { useCreativeStudiosNavigation } from "@/hooks/components/curator/create/use-creative-studios-navigation";
import type { CreativeStudiosType } from "@/lib/types/components/curator/create/creative-studios";

function CreativeStudiosFlowContent({ type }: { type: CreativeStudiosType }) {
  const router = useRouter();
  const { step } = useCreativeStudiosNavigation(type);
  const bounds = CREATIVE_STUDIOS_STEP_BOUNDS[type];
  const rawStep = step;

  useEffect(() => {
    const parsed = Number(rawStep);
    if (Number.isNaN(parsed) || parsed < bounds.min || parsed > bounds.max) {
      router.replace(
        DYNAMIC_ROUTES.curator.createFlow(type, bounds.min) as Route,
      );
    }
  }, [rawStep, bounds.min, bounds.max, router, type]);

  switch (type) {
    case "campus":
      return step === 2 ? <CampusStep2 /> : <CampusStep1 />;
    case "provider":
      return step === 2 ? <ProviderStep2 /> : <ProviderStep1 />;
    case "programme":
      return step === 2 ? <ProgrammeStep2 /> : <ProgrammeStep1 />;
    case "tag":
      return <TagForm />;
    default:
      notFound();
  }
}

export function CreativeStudiosFlowView({ typeParam }: { typeParam: string }) {
  if (!isCreativeStudiosType(typeParam)) {
    notFound();
  }

  return <CreativeStudiosFlowContent type={typeParam} />;
}
