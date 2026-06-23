"use client";

import { useRef } from "react";
import "@/features/join-as-provider-page/components/providers/richTextGlobals.css";
import { useScaleToFit } from "@/features/join-as-provider-page/hooks/useScaleToFit";
import { useProvidersAnimation } from "@/features/join-as-provider-page/hooks/useProvidersAnimation";
import { DarkBg } from "@/features/join-as-provider-page/components/providers/DarkBg";
import { ProviderNav } from "@/features/join-as-provider-page/components/providers/ProviderNav";
import { TopHeader } from "@/features/join-as-provider-page/components/providers/TopHeader";
import { BodyCopy } from "@/features/join-as-provider-page/components/providers/BodyCopy";
import { ProductCards } from "@/features/join-as-provider-page/components/providers/ProductCards";
import { ClosingSection } from "@/features/join-as-provider-page/components/providers/ClosingSection";
import { LockInButton } from "@/features/join-as-provider-page/components/providers/LockInButton";

export default function ProvidersPage() {
  const scaleRootRef = useRef<HTMLDivElement>(null);
  const bodyCopyRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = [
    useRef<HTMLParagraphElement>(null),
    useRef<HTMLParagraphElement>(null),
    useRef<HTMLParagraphElement>(null),
  ];

  const applyScale = useScaleToFit(scaleRootRef);
  const { state } = useProvidersAnimation(bodyCopyRef, bubbleRefs, applyScale);

  return (
    <>
      <style>{`
        .prov-root {
          /* ── design tokens ── */
          --prov-purple:       #955aa4;
          --prov-purple-soft:  #ad74c1;
          --prov-blue:         #2b3990;
          --prov-green:        #2bb673;
          --prov-red:          #ed1c24;
          --prov-tan:          #e8d4ad;
          --prov-ink:          #16151a;
          --prov-paper:        #ffffff;

       /* fill viewport; transparent so DarkBg shows through */
          background: transparent;
          color: var(--prov-ink);
          position: fixed;
          inset: 0;
        }

        /* dark fallback while bg image loads; prevent scroll */
        html:has(.prov-root),
        body:has(.prov-root) {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          overscroll-behavior: none;
          background: #1b1620;
        }

        .prov-root *,
        .prov-root *::before,
        .prov-root *::after {
          box-sizing: border-box;
        }

        .prov-root a  { text-decoration: none; }
        .prov-root button { font-family: inherit; border: none; background: none; cursor: pointer; }
        .prov-root :focus-visible {
          outline: 3px solid var(--prov-blue);
          outline-offset: 3px;
          border-radius: 6px;
        }

    
        /* ── viewport + scale-root ── */
        .prov-viewport {
          position: fixed;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        .prov-scale-root {
          width: 100%;
          max-width: 1480px;
          padding: 26px 28px 40px;
          transform-origin: top center;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .prov-root * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      <div className={`prov-root`}>
        <DarkBg imageSrc="/Provider-bg.jpg" />

        <div className="prov-viewport">
          <div ref={scaleRootRef} className="prov-scale-root">
            <ProviderNav itemsIn={state.navItemsIn} />

            <TopHeader
              isIn={state.headerIn}
              currentRole={state.currentRole}
              roleVisible={state.roleVisible}
              waveDropped={state.waveDropped}
              waveShaking={state.waveShaking}
            />

            <BodyCopy ref={bodyCopyRef} />

            <ProductCards
              isVisible={state.cardsVisible}
              pills={state.pills}
              bubbles={state.bubbles}
              bubbleRefs={bubbleRefs}
            />

            <ClosingSection
              isVisible={state.closingVisible}
              close1In={state.close1In}
              close2In={state.close2In}
            />

            <LockInButton
              isVisible={state.lockinVisible}
              isIn={state.lockinIn}
            />
          </div>
        </div>
      </div>
    </>
  );
}
