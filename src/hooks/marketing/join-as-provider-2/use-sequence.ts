"use client";

import { useEffect } from "react";
import {
  getElement,
  IDS,
} from "@/hooks/marketing/join-as-provider-2/dom-helpers";
import { JoinAsProvider2SequenceController } from "@/hooks/marketing/join-as-provider-2/sequence-controller";

export function useJoinAsProvider2Sequence() {
  useEffect(() => {
    const roleNode = getElement(IDS.role);
    const waveNode = getElement(IDS.wave);
    const headerNode = getElement(IDS.header);
    const bodyCopyNode = getElement(IDS.bodyCopy);
    const scaleRootNode = getElement(IDS.scaleRoot);
    const cardsWrapNode = getElement(IDS.cardsWrap);
    const closingWrapNode = getElement(IDS.closingWrap);
    const lockInBtnNode = getElement(IDS.lockInBtn);

    const nodes = [
      roleNode,
      waveNode,
      headerNode,
      bodyCopyNode,
      scaleRootNode,
      cardsWrapNode,
      closingWrapNode,
      lockInBtnNode,
    ];

    if (!nodes.every(Boolean)) {
      return () => {};
    }

    const controller = new JoinAsProvider2SequenceController({
      roleNode: roleNode as HTMLElement,
      waveNode: waveNode as HTMLElement,
      headerNode: headerNode as HTMLElement,
      bodyCopyNode: bodyCopyNode as HTMLElement,
      scaleRootNode: scaleRootNode as HTMLElement,
      cardsWrapNode: cardsWrapNode as HTMLElement,
      closingWrapNode: closingWrapNode as HTMLElement,
      lockInBtnNode: lockInBtnNode as HTMLElement,
    });

    controller.mount();
    return () => controller.unmount();
  }, []);
}
