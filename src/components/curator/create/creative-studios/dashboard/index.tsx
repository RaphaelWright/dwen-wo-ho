"use client";

import { Sparkles } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DYNAMIC_ROUTES } from "@/lib/constants/routes";
import { useCreativeStudiosView } from "@/hooks/components/curator/create/use-creative-studios-dashboard";
import type { CreativeStudiosType } from "@/lib/types/components/curator/create/creative-studios";

const NAV_CARD_STAGGER = [
  "cs-slide-up cs-stagger-1",
  "cs-slide-up cs-stagger-2",
  "cs-slide-up cs-stagger-3",
  "cs-slide-up cs-stagger-4",
] as const;

export function CreativeStudiosView() {
  const router = useRouter();
  const { cards } = useCreativeStudiosView();

  const onNavigate = (type: CreativeStudiosType) => {
    router.push(DYNAMIC_ROUTES.curator.createFlow(type, 1) as Route);
  };

  return (
    <div className="cs-page-enter flex min-h-[500px] items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="cs-fade-in bg-primary shadow-primary/20 mb-5 rounded-2xl p-7 pb-8 text-white shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-background/20 flex size-10 items-center justify-center rounded-xl backdrop-blur">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Creative Studios
              </h1>
              <p className="mt-0.5 text-sm text-white/50">
                Click a card to create a new entry
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Button
                key={card.label}
                type="button"
                variant="outline"
                onClick={() => onNavigate(card.type)}
                className={cn(
                  NAV_CARD_STAGGER[i],
                  "border-primary/10 bg-muted hover:bg-muted relative grid h-auto grid-cols-[85%_15%] items-center justify-between gap-2 rounded-2xl p-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_16px_48px_-12px_rgba(124,92,252,0.05)] active:translate-y-0 active:scale-[0.995] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-11 items-center justify-center rounded-xl ${card.color} text-white shadow-2xs`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-foreground text-sm font-semibold">
                      {card.label}
                    </div>
                    <div className="text-muted-foreground mt-0.5 max-w-40 text-xs text-wrap">
                      {card.desc}
                    </div>
                  </div>
                </div>
                <div className="bg-warm-sand flex size-8 shrink-0 items-center justify-center rounded-full p-2 text-xs font-bold text-black">
                  {card.count}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
