"use client";

import { m } from "motion/react";
import {
  HERO_CONTAINER_VARIANTS,
  HERO_ITEM_VARIANTS,
} from "@/lib/constants/components/hero-variants";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import WidthConstraint from "../ui/width-constraint";
import { CheckCircle2 } from "lucide-react";
import { ContainerTextFlip } from "../ui/container-text-flip";
import { MovingButton } from "../ui/moving-border";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import GhanaMap from "../ui/ghana-map";
import { HERO_CONTENT } from "@/lib/constants/components/hero";

// --- Main Hero Component ---
export default function HomePageHero() {
  const router = useRouter();
  const { HOME } = HERO_CONTENT;

  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden pt-6 pb-6">
      <WidthConstraint className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-primary leading-[1.1]">
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
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button
              onClick={() => router.push(ROUTES.patient.checkEmail)}
              size="lg"
              className="w-full sm:w-auto rounded-lg bg-primary text-white px-8 h-12 text-base font-bold shadow-lg shadow-primary/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              {HOME.BUTTONS.GET_STARTED}
            </Button>
            <MovingButton
              onClick={() => router.push(ROUTES.patient.lockIn)}
              variant="outline"
              size="lg"
              borderClassName="h-2 w-18 bg-primary/90"
              containerClassName="h-13 w-full sm:w-auto"
              className="w-full sm:w-auto rounded-lg border-border text-primary bg-background hover:scale-95 px-8 h-12 text-base font-bold transition-all ease-in-out duration-300"
            >
              {HOME.BUTTONS.LOCK_IN}
            </MovingButton>
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
          <GhanaMap className="w-full max-w-full lg:max-w-xl mx-auto drop-shadow-2xl" />
        </m.div>
      </WidthConstraint>
    </section>
  );
}
