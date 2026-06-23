"use client";

import styles from "./Headline.module.css";

interface HeadlineProps {
  typedText: string;
  isTyping: boolean;
  isInactive: boolean;
  isGone: boolean;
}

export function Headline({
  typedText,
  isTyping,
  isInactive,
  isGone,
}: HeadlineProps) {
  return (
    <h1
      className={[
        styles.headline,
        isTyping ? styles.typing : "",
        isInactive ? styles.inactive : "",
        isGone ? styles.gone : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{typedText}</span>
      <span className={styles.cursor}>|</span>
    </h1>
  );
}
