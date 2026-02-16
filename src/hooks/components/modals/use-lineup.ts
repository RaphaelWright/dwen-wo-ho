"use client";

import { useState } from "react";
import {
  INITIAL_LINEUP,
  INITIAL_OTHERS,
} from "@/lib/constants/components/modals/lineup";

export const useLineup = () => {
  const [lineup, setLineup] = useState<string[]>(INITIAL_LINEUP);
  const [others, setOthers] = useState<string[]>(INITIAL_OTHERS);
  const [activeTab, setActiveTab] = useState<"lineup" | "others">("lineup");

  const handleToggle = (name: string) => {
    if (lineup.includes(name)) {
      setLineup((prev) => prev.filter((n) => n !== name));
      setOthers((prev) => (prev.includes(name) ? prev : [...prev, name]));
    } else {
      setLineup((prev) => (prev.includes(name) ? prev : [...prev, name]));
      setOthers((prev) => prev.filter((n) => n !== name));
    }
  };

  return {
    lineup,
    others,
    activeTab,
    setActiveTab,
    handleToggle,
  };
};
