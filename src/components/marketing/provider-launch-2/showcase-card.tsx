import {
  PROVIDER_LAUNCH_2_FOOTER_ICONS,
  PROVIDER_LAUNCH_2_PILL_ICONS,
} from "@/lib/constants/components/marketing/provider-launch-2-icons";
import { cn } from "@/lib/utils";
import type { ProviderLaunch2ShowcaseCardProps } from "@/lib/types/components/marketing/provider-launch-2";

const PILL_CLASS =
  "pl2-card-pill relative z-2 inline-flex items-center gap-[7px] rounded-full bg-(--warm-sand) px-[19px] py-2.5 text-[14.5px] font-bold whitespace-nowrap text-[#3a2f1f] shadow-[0_4px_16px_rgba(0,0,0,0.28)] [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]";

const BUBBLE_CLASS =
  "pl2-card-bubble relative mt-[-17px] w-full overflow-visible rounded-[22px] border border-white/12 bg-[rgba(37,23,13,0.2)] px-[22px] pt-[34px] pb-[18px] text-white shadow-[0_0_30px_rgba(37,23,13,0.4),0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[5px]";

const BODY_CLASS =
  "mt-1.5 h-[200px] overflow-hidden text-sm leading-[1.55] text-white/90 [&_b]:font-bold [&_b]:text-(--provider-launch-highlight)";

const FOOTER_CLASS =
  "pl2-card-footer mt-3.5 flex items-center justify-center gap-[7px] border-t border-white/10 pt-[13px] text-center text-xs font-semibold tracking-[0.01em] text-white";

export function ProviderLaunch2ShowcaseCard({
  cardIndex,
  pillTitle,
  pillIcon,
  footerIcon,
  footerText,
  offsetMiddle,
}: ProviderLaunch2ShowcaseCardProps) {
  const PillIcon = PROVIDER_LAUNCH_2_PILL_ICONS[pillIcon];
  const FooterIcon = PROVIDER_LAUNCH_2_FOOTER_ICONS[footerIcon];

  return (
    <article
      className={cn(
        "flex w-full flex-col items-center",
        offsetMiddle && "mt-[-50px] max-[880px]:mt-0",
      )}
      id={`card${cardIndex}`}
    >
      <div
        className="pl2-card-pin flex h-5 flex-col items-center"
        id={`pin${cardIndex}`}
        aria-hidden="true"
      >
        <span className="size-2 shrink-0 rounded-full bg-(--warm-sand) shadow-[0_0_9px_rgba(173,116,193,0.65)]" />
        <span className="mt-px w-[1.5px] flex-1 bg-gradient-to-b from-(--warm-sand) from-30% to-white/18" />
      </div>
      <span className={PILL_CLASS} id={`pill${cardIndex}`}>
        <PillIcon
          className="size-3.5 shrink-0"
          aria-hidden="true"
          strokeWidth={2.25}
        />
        {pillTitle}
      </span>
      <div className={BUBBLE_CLASS} id={`bubble${cardIndex}`}>
        <div className={BODY_CLASS} id={`body${cardIndex}`} />
        <div className={FOOTER_CLASS} id={`footer${cardIndex}`}>
          <FooterIcon
            className="size-3.5 shrink-0"
            aria-hidden="true"
            strokeWidth={2.25}
          />
          <span>{footerText}</span>
        </div>
      </div>
    </article>
  );
}
