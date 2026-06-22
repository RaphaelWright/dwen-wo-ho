"use client";

import { useRouter } from "next/navigation";
import { LOCK_IN_2_CONTENT } from "@/lib/constants/components/marketing/lock-in-2";
import { Lock } from "lucide-react";

export function LockIn2Cta() {
  const router = useRouter();
  const { intro, links } = LOCK_IN_2_CONTENT;

  return (
    <button
      className="li2-lock-in-btn bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/10 rounded-full text-2xl font-extrabold shadow-2xs transition-[opacity,transform,width,background,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      id="lockInBtn"
      type="button"
      aria-label="Lock In - Get started now"
      onClick={() => router.push(links.lockIn)}
    >
      <Lock className="size-6" />
      <span className="inline-block overflow-hidden align-middle">
        <span
          className="li2-lock-in-btn-text inline-block transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          id="lockInBtnText"
        >
          {intro.lockInDefault}
        </span>
      </span>
    </button>
  );
}
