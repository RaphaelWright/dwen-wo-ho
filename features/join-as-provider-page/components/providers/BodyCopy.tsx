"use client";

import { forwardRef } from "react";
import styles from "./BodyCopy.module.css";

export const BodyCopy = forwardRef<HTMLDivElement>((_, ref) => {
  return <div ref={ref} className={styles.bodyCopy} />;
});

BodyCopy.displayName = "BodyCopy";
