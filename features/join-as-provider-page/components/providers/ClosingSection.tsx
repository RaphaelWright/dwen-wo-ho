"use client";

import styles from "./ClosingSection.module.css";

interface ClosingSectionProps {
  isVisible: boolean;
  close1In: boolean;
  close2In: boolean;
}

export function ClosingSection({
  isVisible,
  close1In,
  close2In,
}: ClosingSectionProps) {
  return (
    <div
      className={styles.closing}
      style={{ display: isVisible ? "block" : "none" }}
    >
      <p className={`${styles.closingLine} ${close1In ? styles.in : ""}`}>
        These are not three separate products. This is one software.
      </p>
      <p className={`${styles.closingLine} ${close2In ? styles.in : ""}`}>
        And we are calling it&hellip;
      </p>
    </div>
  );
}
