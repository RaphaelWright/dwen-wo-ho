"use client";

import styles from "./Banner.module.css";

interface BannerProps {
  bannerIn: boolean;
  waveDropped: boolean;
  waveShake: boolean;
}

export function Banner({ bannerIn, waveDropped, waveShake }: BannerProps) {
  return (
    <div className={`${styles.banner} ${bannerIn ? styles.in : ""}`}>
      <div className={styles.bannerText}>
        Hello, Gen Z{" "}
        <span
          className={`${styles.wave} ${waveDropped ? styles.dropped : ""} ${waveShake ? styles.shake : ""}`}
        >
          👋
        </span>
      </div>
    </div>
  );
}
