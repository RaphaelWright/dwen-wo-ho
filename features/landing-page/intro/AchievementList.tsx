"use client";

import styles from "./AchievementList.module.css";
import type { IntroState } from "@/features/landing-page/hooks/useIntroAnimation";

const TOP_POSITIONS = [397, 514, 631, 748, 865];

interface AchievementListProps {
  achievements: IntroState["achievements"];
  pauseBtnIn: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
}

export function AchievementList({
  achievements,
  pauseBtnIn,
  isPaused,
  onTogglePause,
}: AchievementListProps) {
  return (
    <>
      {achievements.map((ach, i) => {
        if (!ach.text) return null;
        const top = TOP_POSITIONS[i];
        return (
          <div key={i}>
            <div
              className={[
                styles.achievement,
                ach.in ? styles.in : "",
                ach.active ? styles.active : "",
                ach.pillShake ? styles.shake : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ top }}
            >
              <span className={styles.achievementText}>{ach.text}</span>
            </div>

            <div
              className={[
                styles.achievementEmoji,
                ach.in ? styles.in : "",
                ach.active ? styles.active : "",
                ach.emojiShake ? styles.shake : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ top }}
            >
              {ach.emoji}
            </div>
          </div>
        );
      })}

      <button
        className={`${styles.pauseBtn} ${pauseBtnIn ? styles.in : ""}`}
        onClick={onTogglePause}
        aria-label={isPaused ? "Play" : "Pause"}
      >
        {isPaused ? "▶" : "⏸"}
      </button>
    </>
  );
}
