import { LOCK_IN_2_CHARACTERS } from "@/lib/constants/components/marketing/lock-in-2";
import { cn } from "@/lib/utils";
import Image from "next/image";

const INITIAL_CHARACTER = LOCK_IN_2_CHARACTERS[0];

export function LockIn2HeroSection() {
  return (
    <div
      className="li2-hero li2-hero-artifacts"
      id="hero"
      style={{
        maskImage:
          "linear-gradient(to top, transparent 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 100%)",
        WebkitMaskImage:
          "linear-gradient(to top, transparent 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 100%)",
      }}
    >
      <div className="hero-dots" aria-hidden="true" />
      <div className="hero-pink-circle" aria-hidden="true" />
      <svg
        className="hero-ribbon-stroke"
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="heroRibbonGradient"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: "var(--hero-ribbon-d)" }} />
            <stop offset="35%" style={{ stopColor: "var(--hero-ribbon-c)" }} />
            <stop offset="68%" style={{ stopColor: "var(--hero-ribbon-b)" }} />
            <stop offset="100%" style={{ stopColor: "var(--hero-ribbon-a)" }} />
          </linearGradient>
          <filter
            id="heroRibbonShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.22" />
          </filter>
        </defs>
        <path
          className="ribbon-path"
          d="M 30 280
             C 100 280, 170 270, 170 240
             C 170 200, 30 220, 30 180
             C 30 140, 170 160, 170 120
             C 170 80, 30 100, 30 60
             C 30 20, 100 40, 170 20"
          stroke="url(#heroRibbonGradient)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#heroRibbonShadow)"
        />
      </svg>
      <Image
        className={cn(
          "li2-photo photo relative z-10 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        )}
        id="photo"
        alt={INITIAL_CHARACTER.name}
        src={INITIAL_CHARACTER.photo}
        width={1280}
        height={1080}
        unoptimized
        loading="eager"
        priority
        quality={100}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
