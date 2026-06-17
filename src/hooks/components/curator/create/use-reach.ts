"use client";

import { useState } from "react";

export const useReach = () => {
  const [baseline, setBaseline] = useState("");

  return {
    baseline,
    setBaseline,
  };
};
