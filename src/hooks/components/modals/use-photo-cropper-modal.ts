"use client";

import { useState } from "react";
import { Point } from "@/lib/utils/image-utils";

export const usePhotoCropperModal = () => {
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
