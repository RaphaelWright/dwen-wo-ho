"use client";

import { useState } from "react";

import { useIntroAnimation } from "@/features/landing-page/hooks/useIntroAnimation";
import { Stage } from "@/features/landing-page/intro/Stage";
import { TopBar } from "@/features/landing-page/intro/TopBar";
import { Banner } from "@/features/landing-page/intro/Banner";
import { Headline } from "@/features/landing-page/intro/Headline";
import { MeetPill } from "@/features/landing-page/intro/MeetPill";
import { StatLine } from "@/features/landing-page/intro/StatLine";
import { Photo } from "@/features/landing-page/intro/Photo";
import { AchievementList } from "@/features/landing-page/intro/AchievementList";
import { PatientPage } from "@/features/landing-page/intro/PatientPage";

export default function IntroPage() {
  const { state, togglePause } = useIntroAnimation();
  const [patientPageOpen, setPatientPageOpen] = useState(false);

  return (
    <>
      <style>{`
        .intro-root {
          /* design tokens */
          --intro-black:    #030405;
          --intro-white:    #ffffff;
          --intro-tan:      #e9d6b7;
          --intro-tan-dark: #b88a4a;
          --intro-blue:     #244091;
          --intro-purple:   #965ca3;
          --intro-gray:     #d1d3d4;

          /* layout */
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* make the route fill the viewport without scrolling */
        html:has(.intro-root),
        body:has(.intro-root) {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #ffffff;
        }

        .intro-root *,
        .intro-root *::before,
        .intro-root *::after {
          box-sizing: border-box;
        }
      `}</style>

      <div className={`intro-root`}>
        <Stage isVisible={state.stageVisible} isPaused={state.isPaused}>
          <TopBar
            pledgeIn={state.pledgeIn}
            logoIn={state.logoIn}
            providersIn={state.providersIn}
          />

          <Banner
            bannerIn={state.bannerIn}
            waveDropped={state.waveDropped}
            waveShake={state.waveShake}
          />

          <Headline
            typedText={state.typedText}
            isTyping={state.headlineTyping}
            isInactive={state.headlineInactive}
            isGone={state.headlineGone}
          />

          <MeetPill
            isIn={state.meetPillIn}
            isRelocated={state.meetPillRelocate}
            meetText={state.meetText}
            meetTextVisible={state.meetTextVisible}
            meetEmoji={state.meetEmoji}
            emojiShake={state.meetEmojiShake}
            onClick={() => setPatientPageOpen(true)}
          />

          <StatLine
            prefix={state.statPrefix}
            highlight={state.statHighlight}
            suffix={state.statSuffix}
            isIn={state.statLineIn}
            isGone={state.statLineGone}
          />

          <Photo
            src={state.photoSrc}
            alt={state.photoAlt}
            isIn={state.photoIn}
            photoStyle={state.photoStyle}
          />

          <AchievementList
            achievements={state.achievements}
            pauseBtnIn={state.pauseBtnIn}
            isPaused={state.isPaused}
            onTogglePause={togglePause}
          />
        </Stage>

        <PatientPage
          isVisible={patientPageOpen}
          onBack={() => setPatientPageOpen(false)}
        />
      </div>
    </>
  );
}
