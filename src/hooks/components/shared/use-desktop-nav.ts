"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

export const useDesktopNav = () => {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return {
    pathname,
    hoveredIndex,
    setHoveredIndex,
  };
};
