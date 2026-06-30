"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { SchoolPickerCardProps } from "@/lib/types/components/patient/onboarding";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";

export function SchoolPickerCard({
  id,
  name,
  logo,
  nickname,
  motto,
  studentCount,
  onSelect,
}: SchoolPickerCardProps) {
  const nicknames = nickname ? [nickname, name] : [name];
  const [nicknameIndex, setNicknameIndex] = useState(0);

  useEffect(() => {
    if (nicknames.length <= 1) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setNicknameIndex((current) => (current + 1) % nicknames.length);
    }, 2800);

    return () => window.clearInterval(timer);
  }, [nicknames.length]);

  const displayNickname = nicknames[nicknameIndex] ?? name;
  const lockedInLabel = `${studentCount.toLocaleString()} ${ONBOARDING_COPY.schoolType.lockedInSuffix}`;

  return (
    <div
      role="button"
      tabIndex={0}
      id={id}
      onClick={onSelect}
      onKeyDown={activateOnKeyboard(onSelect)}
      className="border-border bg-card hover:border-primary hover:bg-accent group relative flex min-h-44 cursor-pointer flex-col overflow-hidden rounded-2xl border-2 transition-colors"
    >
      <div className="relative h-28 w-full overflow-hidden bg-black/20">
        {logo ? (
          <Image
            src={logo}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 240px"
          />
        ) : (
          <div className="bg-primary/20 flex h-full items-center justify-center text-2xl font-bold">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 text-left">
        <p className="text-primary text-xs font-semibold tracking-wide uppercase">
          {displayNickname}
        </p>
        <p className="text-foreground line-clamp-1 text-sm font-semibold">
          {name}
        </p>
        {motto ? (
          <p className="text-muted-foreground line-clamp-2 text-xs">{motto}</p>
        ) : null}
        <p className="text-success mt-auto text-xs font-semibold">
          {lockedInLabel}
        </p>
      </div>
    </div>
  );
}
