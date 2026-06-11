"use client";

import { m } from "motion/react";
import { Button } from "../ui/button";
import {
  HERO_CONTAINER_VARIANTS,
  HERO_ITEM_VARIANTS,
} from "@/lib/constants/components/hero-variants";
import WidthConstraint from "../ui/width-constraint";
import { CheckCircle2 } from "lucide-react";
import { ContainerTextFlip } from "../ui/container-text-flip";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import { HERO_CONTENT } from "@/lib/constants/components/hero";
import OrbitalCarousel from "../ui/orbital-carousel";
import { orbitalItemsLocal } from "./orbital-items";
import { useProvidersHero } from "@/hooks/components/hero/use-providers-hero";

export default function ProviderPageHero() {
  const { BUTTON_TEXT, handleProviderAuth } = useProvidersHero();
  const { HOME } = HERO_CONTENT;

  return (
    <section className="relative flex items-center overflow-hidden">
      <WidthConstraint className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-24 lg:mt-0">
        {/* Left Content */}
        <m.div
          variants={HERO_CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center text-left space-y-8 z-20"
        >
          {/* Badge */}
          <m.div variants={HERO_ITEM_VARIANTS}>
            <div className="inline-flex items-center rounded-full">
              <ContainerTextFlip
                words={HOME.BADGE_WORDS}
                className="h-auto p-1.5! text-sm! md:text-sm! text-muted-foreground/90"
              />
            </div>
          </m.div>

          {/* Heading */}
          <m.div variants={HERO_ITEM_VARIANTS}>
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tight text-primary leading-[1.1]">
              {HOME.TITLE}
            </h1>
          </m.div>

          {/* Description */}
          <m.div
            variants={HERO_ITEM_VARIANTS}
            className="text-lg text-muted-foreground leading-relaxed max-w-lg font-medium"
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
              className="rounded-lg bg-primary text-white px-8 h-12 text-base font-bold shadow-lg shadow-primary/50 transition-all duration-300 transform hover:-translate-y-1"
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
                className="flex items-center gap-3 text-muted-foreground font-medium"
              >
                <div className="rounded-full bg-primary/70 p-0.5">
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
            className="w-full max-w-full lg:max-w-xl mx-auto drop-shadow-2xl"
          />
        </m.div>
      </WidthConstraint>
    </section>
  );
}
