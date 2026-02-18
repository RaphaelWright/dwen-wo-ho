"use client";

import { motion, AnimatePresence } from "framer-motion";
import Memoriam from "../miscellaneous/memoriam";
import WidthConstraint from "../ui/width-constraint";
import Image from "next/image";
import { Button } from "../ui/button";
import { usePatientsHero } from "@/hooks/components/hero/use-patients-hero";

const PatientsHero = () => {
  const {
    PATIENTS,
    TEXTS,
    COLORS,
    BUTTONS,
    IMAGES,
    currentTextIndex,
    containerVariants,
    itemVariants,
    imageVariants,
    handleGetStarted,
    handleLockIn,
  } = usePatientsHero();

  return (
    <section className="bg-white py-10">
      <WidthConstraint>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-16 lg:py-24"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-5 items-center mt-12"
          >
            <motion.div
              variants={itemVariants}
              className="space-y-4 flex gap-4 flex-col text-center"
            >
              <h1 className="text-4xl lg:text-5xl leading-0 font-bold text-[#2BA36A]">
                {PATIENTS.TITLE}
              </h1>
              <p className="text-lg lg:text-xl font-bold lg:max-w-100">
                {PATIENTS.SUBTITLE}
              </p>
            </motion.div>
            <motion.div
              variants={imageVariants}
              className="aspect-video bg-gray-50 rounded-lg overflow-hidden"
            >
              <Image
                src={IMAGES.LADY_PAINTING}
                alt=""
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-5 items-center"
          >
            <motion.div
              variants={imageVariants}
              className="aspect-video bg-gray-50 rounded-lg overflow-hidden mt-8"
            >
              <Image
                src={IMAGES.WOMAN_PAINTING}
                alt=""
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="space-y-5 py-4 text-center"
            >
              <div className="flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentTextIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ color: COLORS[currentTextIndex] }}
                    className="text-2xl lg:text-3xl font-bold absolute"
                  >
                    {TEXTS[currentTextIndex]}
                  </motion.h2>
                </AnimatePresence>
              </div>
              <p className="text-lg lg:text-xl font-bold leading-relaxed">
                {PATIENTS.SUBTITLE_SUFFIX}
              </p>
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-3 items-center"
              >
                <Button
                  onClick={handleGetStarted}
                  className="bg-gray-200 text-[#D94A54] font-bold lg:text-[17px] hover:bg-gray-300 px-8"
                >
                  {BUTTONS.GET_STARTED}
                </Button>
                <Button
                  onClick={handleLockIn}
                  className="bg-gray-200 text-[#D94A54] font-bold lg:text-[17px] hover:bg-gray-300 px-8"
                >
                  {BUTTONS.LOCK_IN}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </WidthConstraint>
      <Memoriam showQuote={true} />
    </section>
  );
};

export default PatientsHero;
