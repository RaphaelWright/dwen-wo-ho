"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import WidthConstraint from "../ui/width-constraint";
import { CheckCircle2 } from "lucide-react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { ContainerTextFlip } from "../ui/container-text-flip";
import { MovingButton } from "../ui/moving-border";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import GhanaMap from "../ui/ghana-map";
import { HERO_CONTENT } from "@/lib/constants/components/hero";

export function HomePageHeroDraggableCards() {
  const items = HERO_CONTENT.HOME.DRAGGABLE_CARDS;

  return (
    <DraggableCardContainer>
      {/* 1. The Wave Pattern (Top Left of the cluster) */}
      <div className="absolute top-0 right-0 size-20 opacity-20 pointer-events-none z-0 rotate-90">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
          <path
            d="M0 20 Q 25 40 50 20 T 100 20"
            stroke="#7c4a8a"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 40 Q 25 60 50 40 T 100 40"
            stroke="#7c4a8a"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* 2. The Main Purple Solid Shape */}
      <div className="absolute top-0 right-1/2 size-20  bg-[#8b5cf6] rounded-3xl -rotate-3 z-0 pointer-events-none opacity-90" />

      {/* 3. The Darker Purple Accent (Behind middle image) */}
      <div className="absolute -bottom-45 right-0 size-20 bg-[#7c3aed] rounded-2xl z-0 pointer-events-none opacity-80" />

      {/* 4. The Blue Semi-Circle (Bottom accent) */}
      <div
        className="absolute -bottom-45 -left-10 size-20 bg-[#3b82f6] rounded-full z-0 pointer-events-none opacity-90"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      />

      {/* 5. Dots Pattern (Top Right) */}
      <div className="absolute top-0 bottom-0 right-0 left-0 grid grid-cols-6 gap-2 opacity-20 z-0 pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-gray-800" />
        ))}
      </div>

      {/* --- IMAGES --- */}
      {items.map((item, i) => (
        <DraggableCardBody
          key={i}
          className={`${item.className} bg-transparent shadow-xl p-0 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform duration-300`}
        >
          <Image
            src={item.image}
            alt={item.alt}
            width={500}
            height={500}
            className="pointer-events-none w-full h-full object-cover rounded-lg"
          />
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}

// --- Main Hero Component ---
export default function HomePageHero() {
  const router = useRouter();
  const { HOME } = HERO_CONTENT;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="relative flex items-center overflow-hidden">
      <WidthConstraint className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-24 lg:mt-0">
        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center text-left space-y-8 z-20"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center rounded-full">
              <ContainerTextFlip
                words={HOME.BADGE_WORDS}
                className="h-auto p-1.5! text-sm! md:text-sm! text-muted-foreground/90"
              />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants}>
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tight text-primary leading-[1.1]">
              {HOME.TITLE}
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div
            variants={itemVariants}
            className="text-lg text-muted-foreground leading-relaxed max-w-lg font-medium"
          >
            <TextGenerateEffect words={HOME.DESCRIPTION} />
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4"
          >
            <Button
              onClick={() => router.push(ROUTES.patient.checkEmail)}
              size="lg"
              className="rounded-lg bg-primary text-white px-8 h-12 text-base font-bold shadow-lg shadow-primary/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              {HOME.BUTTONS.GET_STARTED}
            </Button>
            <MovingButton
              onClick={() => router.push(ROUTES.patient.lockIn)}
              variant="outline"
              size="lg"
              borderClassName="h-2 w-18 bg-primary/90"
              containerClassName="h-13"
              className="rounded-lg border-border text-primary bg-background hover:scale-95 px-8 h-12 text-base font-bold transition-all ease-in-out duration-300"
            >
              {HOME.BUTTONS.LOCK_IN}
            </MovingButton>
          </motion.div>

          {/* Features List */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-3 pt-4"
          >
            {HOME.FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-muted-foreground font-medium"
              >
                <div className="rounded-full bg-primary/70 p-0.5">
                  <CheckCircle2 className="size-4 text-white" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Content: Composition Collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative lg:-mr-12"
        >
          <GhanaMap className="w-full max-w-full lg:max-w-xl mx-auto drop-shadow-2xl" />
        </motion.div>
      </WidthConstraint>
    </section>
  );
}
