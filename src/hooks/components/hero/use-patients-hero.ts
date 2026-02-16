import { useState, useEffect } from "react";
import { easeOut } from "framer-motion";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { HERO_CONTENT } from "@/lib/constants/components/hero";

export const usePatientsHero = () => {
  const router = useRouter();
  const { PATIENTS } = HERO_CONTENT;
  const { TEXTS, COLORS, BUTTONS, IMAGES } = PATIENTS;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % TEXTS.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [TEXTS.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  const handleGetStarted = () => {
    router.push(ROUTES.patient.checkEmail);
  };

  const handleLockIn = () => {
    router.push(ROUTES.patient.lockIn);
  };

  return {
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
  };
};
