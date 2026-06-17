"use client";

import { useState } from "react";
import { Point } from "@/lib/types/components/shared/geometry";

export const usePhotoCropper = () => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return {
    crop,
    setCrop,
    zoom,
    setZoom,
    handleReset,
  };
};
