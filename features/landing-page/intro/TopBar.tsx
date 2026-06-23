"use client";

import { Logo } from "@/components/shared/logo";
import styles from "./TopBar.module.css";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/infra/routes";

interface TopBarProps {
  pledgeIn: boolean;
  logoIn: boolean;
  providersIn: boolean;
}

export function TopBar({ pledgeIn, logoIn, providersIn }: TopBarProps) {
  return (
    <>
      <Link
        className={`${styles.pill} ${styles.pledge} ${pledgeIn ? styles.in : ""}`}
        href={"/"}
      >
        The Pledge
      </Link>

      <div className={`${styles.logo} ${logoIn ? styles.in : ""}`}>
        <Logo variant="purple" className="w-sm" />
      </div>

      <Link
        className={`${styles.pill} ${styles.providers} ${providersIn ? styles.in : ""}`}
        href={ROUTES.public.joinAsProvider}
      >
        Providers <span className={styles.arrow}>↗</span>
      </Link>
    </>
  );
}
