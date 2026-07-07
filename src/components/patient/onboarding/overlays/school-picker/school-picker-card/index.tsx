"use client";

import { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import type { SchoolPickerCardProps } from "@/lib/types/components/patient/onboarding";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";

function formatLockedInCount(count: number): string {
  if (count >= 1000) {
    return `${Math.round(count / 1000)}K`;
  }
  return String(count);
}

export function SchoolPickerCard({
  id,
  name,
  logo,
  nickname,
  motto,
  studentCount,
  animationDelay = 0,
  onSelect,
}: SchoolPickerCardProps) {
  const nicknames = nickname
    ? nickname.split(",").map((part) => part.trim())
    : [name];
  const [nicknameIndex, setNicknameIndex] = useState(0);
  const contentDelay = animationDelay + 0.22;
  const displayNickname = nicknames[nicknameIndex] ?? name;
  const mottoLine = motto ? `${motto}` : "";

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
    }, 5000);

    return () => window.clearInterval(timer);
  }, [nicknames.length]);

  return (
    <div
      role="button"
      tabIndex={0}
      id={id}
      className="school-card"
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={onSelect}
      onKeyDown={activateOnKeyboard(onSelect)}
    >
      <div
        className="logo-bg"
        style={logo ? { backgroundImage: `url('${logo}')` } : undefined}
      />
      <div className="shade" />
      <div
        className="lockedin-pill"
        style={{ animationDelay: `${contentDelay}s` }}
      >
        <IoStar className="star" aria-hidden="true" />
        <span className="count">{formatLockedInCount(studentCount)}</span>{" "}
        Locked In
      </div>
      <div
        className="school-nick-wrap"
        style={{ animationDelay: `${contentDelay}s` }}
      >
        <div className="school-nick">{displayNickname}</div>
      </div>
      <div
        className="school-card-content"
        style={{ animationDelay: `${contentDelay}s` }}
      >
        <div className="school-fullname">{name}</div>
        {mottoLine ? <div className="school-motto">{mottoLine}</div> : null}
      </div>
    </div>
  );
}
