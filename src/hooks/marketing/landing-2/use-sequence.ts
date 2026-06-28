"use client";

import { useEffect } from "react";
import { LANDING_2_SEQUENCE_IDS as IDS } from "@/lib/constants/components/marketing/landing-2-sequence";
import { getElement } from "@/hooks/marketing/landing-2/dom-helpers";
import { Landing2SequenceController } from "@/hooks/marketing/landing-2/sequence-controller";

export function useLanding2Sequence() {
  useEffect(() => {
    const shell = getElement(IDS.shell);
    const stage = getElement(IDS.stage);
    const hero = getElement(IDS.hero);
    const lockInBtn = getElement(IDS.lockInBtn);

    if (!shell || !stage || !hero || !lockInBtn) {
      return () => {};
    }

    const controller = new Landing2SequenceController({
      shell,
      stage,
      hero,
      lockInBtn,
    });
    controller.mount();
    return () => controller.unmount();
  }, []);
}
