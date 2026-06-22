"use client";

import { LockIn2AchievementCard } from "@/components/marketing/lock-in-2/achievement-card";
import { LockIn2HeadlineTyped } from "@/components/marketing/lock-in-2/headline-typed";
import { LockIn2HeroSection } from "@/components/marketing/lock-in-2/hero-section";
import { LockIn2IntroBanner } from "@/components/marketing/lock-in-2/intro-banner";
import { LockIn2Cta } from "@/components/marketing/lock-in-2/lock-in-cta";
import { LockIn2Nav } from "@/components/marketing/lock-in-2/lock-in-2-nav";
import { LockIn2StageControls } from "@/components/marketing/lock-in-2/stage-controls";
import { LockIn2StatLine } from "@/components/marketing/lock-in-2/stat-line";
import { useLockIn2Sequence } from "@/hooks/components/marketing/lock-in-2";
import { LOCK_IN_2_ACHIEVEMENT_SLOTS } from "@/lib/constants/components/marketing/lock-in-2";

export function LockIn2() {
  useLockIn2Sequence();

  return (
    <div
      className="lock-in-2-shell bg-background text-foreground fixed inset-0 overflow-hidden overscroll-none antialiased"
      id="lockIn2Shell"
    >
      <LockIn2Nav />
      <div className="fixed inset-0 z-1 flex h-full w-full items-center justify-center overflow-hidden overscroll-none">
        <div
          className="li2-stage bg-background relative h-[1080px] w-[1960px] shrink-0 transition-opacity duration-400 ease-out will-change-transform"
          id="stage"
        >
          <LockIn2HeadlineTyped />
          <LockIn2IntroBanner />
          <LockIn2StatLine />
          <LockIn2HeroSection />
          {LOCK_IN_2_ACHIEVEMENT_SLOTS.map((slot) => (
            <LockIn2AchievementCard key={slot.id} slot={slot} />
          ))}
          <LockIn2StageControls />
          <LockIn2Cta />
        </div>
      </div>
    </div>
  );
}
