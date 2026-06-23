"use client";

import Link from "next/link";
import styles from "./LockInButton.module.css";
import { ROUTES } from "@/lib/constants/infra/routes";

interface LockInButtonProps {
  isVisible: boolean;
  isIn: boolean;
}

export function LockInButton({ isVisible, isIn }: LockInButtonProps) {
  return (
    <div
      className={styles.lockinWrap}
      style={{ display: isVisible ? "flex" : "none" }}
    >
      <Link
        href={ROUTES.provider.auth}
        className={`${styles.lockinBtn} ${isIn ? styles.in : ""}`}
      >
        LOCK IN 2.0 🔒
      </Link>
    </div>
  );
}
