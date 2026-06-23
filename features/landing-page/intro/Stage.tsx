"use client";

import { useEffect, useRef } from "react";
import styles from "./Stage.module.css";

interface StageProps {
  isVisible: boolean;
  isPaused: boolean;
  children: React.ReactNode;
}

export function Stage({ isVisible, isPaused, children }: StageProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function fitStage() {
      if (!stageRef.current) return;
      const scale = Math.min(
        window.innerWidth / 1920,
        window.innerHeight / 1080,
      );
      stageRef.current.style.transform = `scale(${scale})`;
    }
    fitStage();
    window.addEventListener("resize", fitStage);
    return () => window.removeEventListener("resize", fitStage);
  }, []);

  return (
    <div className={styles.viewport}>
      <div
        ref={stageRef}
        className={`${styles.stage} ${isVisible ? styles.in : ""} ${isPaused ? styles.paused : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
