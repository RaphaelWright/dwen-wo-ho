"use client";

import { m } from "motion/react";
import {
  HERO_CONTAINER_VARIANTS,
  HERO_ITEM_VARIANTS,
} from "@/lib/constants/components/marketing/landing";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import WidthConstraint from "../ui/width-constraint";
import { CheckCircle2 } from "lucide-react";
import { ContainerTextFlip } from "../ui/container-text-flip";
import { MovingButton } from "../ui/moving-border";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import GhanaMap from "../ui/ghana-map";
import { HERO_CONTENT } from "@/lib/constants/components/marketing/landing";

// --- Main Hero Component ---
export default function HomePageHero() {
  const router = useRouter();
  const { HOME } = HERO_CONTENT;

  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden pt-6 pb-6">
      <WidthConstraint className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
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
            <h1 className="text-primary text-4xl leading-[1.1] font-bold tracking-tight md:text-6xl lg:text-8xl">
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
            className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row"
          >
            <Button
              onClick={() => router.push(ROUTES.patient.checkEmail)}
              size="lg"
              className="bg-primary shadow-primary/50 h-12 w-full transform rounded-lg px-8 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 sm:w-auto"
            >
              {HOME.BUTTONS.GET_STARTED}
            </Button>
            <MovingButton
              onClick={() => router.push(ROUTES.patient.lockIn)}
              variant="outline"
              size="lg"
              borderClassName="h-2 w-18 bg-primary/90"
              containerClassName="h-13 w-full sm:w-auto"
              className="border-border text-primary bg-background h-12 w-full rounded-lg px-8 text-base font-bold transition-all duration-300 ease-in-out hover:scale-95 sm:w-auto"
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
          <GhanaMap className="mx-auto w-full max-w-full drop-shadow-2xl lg:max-w-xl" />
        </m.div>
      </WidthConstraint>
    </section>
  );
}
