import Image from "next/image";
import { LOCK_IN_2_CONTENT } from "@/lib/constants/components/marketing/lock-in-2";

export function LockIn2IntroBanner() {
  const { intro, assets } = LOCK_IN_2_CONTENT;

  return (
    <div
      className="li2-banner flex items-center justify-center transition-[opacity,transform] duration-700 ease-out"
      id="banner"
      aria-live="polite"
    >
      <div className="text-[90px] leading-none font-extrabold whitespace-nowrap text-(--provider-launch-highlight)">
        {intro.bannerText}{" "}
        <span
          className="li2-wave ml-3.5 inline-block origin-[75%_75%] align-bottom leading-none transition-[opacity,transform] duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          id="wave"
        >
          <Image
            className="block size-[1em] object-contain"
            src={assets.wave}
            alt=""
            width={90}
            height={90}
            unoptimized
          />
        </span>
      </div>
    </div>
  );
}
