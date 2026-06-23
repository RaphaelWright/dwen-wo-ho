"use client";

import { m } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  HERO_CONTAINER_VARIANTS,
  HERO_ITEM_VARIANTS,
} from "@/_unused/lib/marketing/landing";
import WidthConstraint from "@/components/ui/width-constraint";
import { CheckCircle2 } from "lucide-react";
import { ContainerTextFlip } from "@/_unused/components/container-text-flip";
import { TextGenerateEffect } from "@/_unused/components/text-generate-effect";
import { HERO_CONTENT } from "@/_unused/lib/marketing/landing";
import OrbitalCarousel from "@/_unused/components/orbital-carousel";
import { orbitalItemsLocal } from "./orbital-items";
import { useProvidersHero } from "@/hooks/components/marketing/join-as-provider/hero";

export default function ProviderPageHero() {
  const { BUTTON_TEXT, handleProviderAuth } = useProvidersHero();
  const { HOME } = HERO_CONTENT;

  return (
    <section className="relative flex items-center overflow-hidden">
      <WidthConstraint className="mt-24 grid items-center gap-12 lg:mt-0 lg:grid-cols-2 lg:gap-16">
        {/* Left Content */}
        <m.div
          variants={HERO_CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
          className="z-20 flex flex-col justify-center space-y-8 text-left"
        >
          {/* Badge */}
          <m.div variants={HERO_ITEM_VARIANTS}>
            <div className="inline-flex items-center rounded-full">
              <ContainerTextFlip
                words={HOME.BADGE_WORDS}
                className="text-muted-foreground/90 h-auto p-1.5! text-sm! md:text-sm!"
              />
            </div>
          </m.div>

          {/* Heading */}
          <m.div variants={HERO_ITEM_VARIANTS}>
            <h1 className="text-primary text-6xl leading-[1.1] font-bold tracking-tight lg:text-8xl">
              {HOME.TITLE}
            </h1>
          </m.div>

          {/* Description */}
          <m.div
            variants={HERO_ITEM_VARIANTS}
            className="text-muted-foreground max-w-lg text-lg leading-relaxed font-medium"
          >
            <TextGenerateEffect words={HOME.DESCRIPTION} />
          </m.div>

          {/* Buttons */}
          <m.div
            variants={HERO_ITEM_VARIANTS}
            className="flex flex-wrap items-center gap-4"
          >
            <Button
              onClick={handleProviderAuth}
              size="lg"
              className="bg-primary shadow-primary/50 h-12 transform rounded-lg px-8 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {BUTTON_TEXT}
            </Button>
          </m.div>

          {/* Features List */}
          <m.div
            variants={HERO_ITEM_VARIANTS}
            className="flex flex-col gap-3 pt-4"
          >
            {HOME.FEATURES.map((feature) => (
              <div
                key={feature}
                className="text-muted-foreground flex items-center gap-3 font-medium"
              >
                <div className="bg-primary/70 rounded-full p-0.5">
                  <CheckCircle2 className="size-4 text-white" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </m.div>
        </m.div>

        {/* Right Content: Composition Collage */}
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative lg:-mr-12"
        >
          <OrbitalCarousel
            items={orbitalItemsLocal}
            className="mx-auto w-full max-w-full drop-shadow-2xl lg:max-w-xl"
          />
        </m.div>
      </WidthConstraint>
    </section>
  );
}
