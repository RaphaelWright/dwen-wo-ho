"use client";

import styles from "./StatLine.module.css";

interface StatLineProps {
  prefix: string;
  highlight: string;
  suffix: string;
  isIn: boolean;
  isGone: boolean;
}

export function StatLine({
  prefix,
  highlight,
  suffix,
  isIn,
  isGone,
}: StatLineProps) {
  return (
    <p
      className={[
        styles.statLine,
        isIn ? styles.in : "",
        isGone ? styles.gone : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {prefix}
      <span className={styles.statHighlight}>{highlight}</span>
      {suffix}
    </p>
  );
}
