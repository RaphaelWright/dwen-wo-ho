"use client";

import styles from "./TopHeader.module.css";

interface TopHeaderProps {
  isIn: boolean;
  currentRole: string;
  roleVisible: boolean;
  waveDropped: boolean;
  waveShaking: boolean;
}

export function TopHeader({
  isIn,
  currentRole,
  roleVisible,
  waveDropped,
  waveShaking,
}: TopHeaderProps) {
  return (
    <h1 className={`${styles.topHeader} ${isIn ? styles.in : ""}`}>
      <span>Hello,</span>{" "}
      <span className={`${styles.role} ${!roleVisible ? styles.out : ""}`}>
        {currentRole}
      </span>{" "}
      <span
        className={`${styles.wave} ${waveDropped ? styles.drop : ""} ${waveShaking ? styles.shake : ""}`}
      >
        👋
      </span>
    </h1>
  );
}
