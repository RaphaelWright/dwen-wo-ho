"use client";

import styles from "./DarkBg.module.css";

interface DarkBgProps {
  /** Path to your background photo in /public, e.g. "/Provider-bg.jpg" */
  imageSrc?: string;
}

export function DarkBg({ imageSrc = "/pic" }: DarkBgProps) {
  return (
    <div
      className={styles.darkBg}
      style={{
        backgroundImage: [
          "radial-gradient(circle at 18% 22%, rgba(173,116,193,.22), transparent 42%)",
          "radial-gradient(circle at 82% 18%, rgba(43,182,115,.14), transparent 45%)",
          "radial-gradient(circle at 70% 82%, rgba(232,212,173,.12), transparent 50%)",
          "linear-gradient(160deg, rgba(27,22,32,.72) 0%, rgba(34,26,31,.72) 45%, rgba(21,17,15,.80) 100%)",
          `url('${imageSrc}')`,
        ].join(", "),
      }}
      aria-hidden="true"
    />
  );
}
