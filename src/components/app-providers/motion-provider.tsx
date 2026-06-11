"use client";

import { ReactNode } from "react";
import { LazyMotion, domMax } from "motion/react";

export default function MotionProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <LazyMotion features={domMax}>{children}</LazyMotion>;
}
