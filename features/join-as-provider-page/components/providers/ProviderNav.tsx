"use client";

import { Logo } from "@/components/shared/logo";
import styles from "./ProviderNav.module.css";
import { ROUTES } from "@/lib/constants/infra/routes";
import Link from "next/link";

interface ProviderNavProps {
  itemsIn: boolean[]; // [logo, link, cta]
}

export function ProviderNav({ itemsIn }: ProviderNavProps) {
  return (
    <nav className={styles.nav}>
      <Logo variant="white" withLink href={ROUTES.public.landing} />

      <p
        className={`${styles.navItem} ${styles.navLink} ${itemsIn[1] ? styles.drop : ""}`}
      >
        Providers
      </p>

      <Link
        href={ROUTES.provider.auth}
        className={`${styles.navItem} ${styles.getStarted} ${itemsIn[2] ? styles.drop : ""}`}
      >
        Get Started
      </Link>
    </nav>
  );
}
