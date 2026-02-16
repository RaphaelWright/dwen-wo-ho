"use client";

import Memoriam from "../miscellaneous/memoriam";
import WidthConstraint from "../ui/width-constraint";
import Image from "next/image";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../shared/header";
import { useProvidersHero } from "@/hooks/components/hero/use-providers-hero";

const ProvidersHero = () => {
  const {
    TEXTS,
    COLORS,
    TITLE,
    IMAGE,
    BUTTON_TEXT,
    currentTextIndex,
    handleProviderAuth,
  } = useProvidersHero();
  return (
    <>
      <Header className="bg-gray-200" />
      <section className="bg-white">
        <div className="relative h-150 lg:h-182 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={IMAGE.SRC}
              alt={IMAGE.ALT}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <WidthConstraint>
              <div className="max-w-5xl mx-auto space-y-20">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                    <span className="text-white">{TITLE.PREFIX}</span>{" "}
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentTextIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{ color: COLORS[currentTextIndex] }}
                        className="inline-block"
                      >
                        {TEXTS[currentTextIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </h1>
                  <p className="text-xl lg:text-2xl text-white/90 font-bold max-w-3xl mx-auto">
                    {TITLE.SUFFIX}
                  </p>
                </div>
                <Button
                  onClick={handleProviderAuth}
                  className="bg-gray-200 text-[#D94A54] lg:text-[17px] font-bold hover:bg-gray-300 px-8"
                >
                  {BUTTON_TEXT}
                </Button>
              </div>
            </WidthConstraint>
          </div>
        </div>

        <Memoriam showQuote={true} />
      </section>
    </>
  );
};

export default ProvidersHero;
