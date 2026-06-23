"use client";

import styles from "./MeetPill.module.css";

interface MeetPillProps {
  isIn: boolean;
  isRelocated: boolean;
  meetText: string;
  meetTextVisible: boolean;
  meetEmoji: string;
  emojiShake: boolean;
  onClick: () => void;
}

export function MeetPill({
  isIn,
  isRelocated,
  meetText,
  meetTextVisible,
  meetEmoji,
  emojiShake,
  onClick,
}: MeetPillProps) {
  return (
    <div
      className={[
        styles.meetPill,
        isIn ? styles.in : "",
        isRelocated ? styles.relocate : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <span
        className={styles.meetText}
        style={{ opacity: meetTextVisible ? 1 : 0 }}
      >
        {meetText}
      </span>
      <span className={`${styles.meetEmoji} ${emojiShake ? styles.shake : ""}`}>
        {meetEmoji}
      </span>
    </div>
  );
}
