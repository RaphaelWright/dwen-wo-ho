import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { HERO_CONTENT } from "@/lib/constants/components/hero";

export const useProvidersHero = () => {
  const router = useRouter();
  const { PROVIDERS } = HERO_CONTENT;
  const { TEXTS, COLORS, TITLE, IMAGE, BUTTON_TEXT } = PROVIDERS;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % TEXTS.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [TEXTS.length]);

  const handleProviderAuth = () => {
    router.push(ROUTES.provider.auth);
  };

  return {
    PROVIDERS,
    TEXTS,
    COLORS,
    TITLE,
    IMAGE,
    BUTTON_TEXT,
    currentTextIndex,
    handleProviderAuth,
  };
};
