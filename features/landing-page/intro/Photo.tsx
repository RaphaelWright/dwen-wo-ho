"use client";

import Image from "next/image";
import styles from "./Photo.module.css";

interface PhotoProps {
  src: string;
  alt: string;
  isIn: boolean;
  photoStyle: React.CSSProperties;
}

export function Photo({ src, alt, isIn, photoStyle }: PhotoProps) {
  if (!src) return null;

  // Extract numeric pixel values for next/image width/height (falls back to unoptimised img)
  const w =
    typeof photoStyle.width === "string" && photoStyle.width.endsWith("px")
      ? parseInt(photoStyle.width, 10)
      : undefined;
  const h =
    typeof photoStyle.height === "string" && photoStyle.height.endsWith("px")
      ? parseInt(photoStyle.height, 10)
      : undefined;

  const cls = `${styles.photo} ${isIn ? styles.in : ""}`;

  // Use a regular <img> to honour the arbitrary photoStyle exactly (same as the original)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cls} src={src} alt={alt} style={photoStyle} />
  );
}
