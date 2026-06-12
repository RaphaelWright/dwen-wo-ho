"use client";

import { m } from "motion/react";

interface LoadingOverlayProps {
  text: string;
  isVisible: boolean;
}

const LoadingOverlay = ({ text, isVisible }: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background/50 fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      aria-busy="true"
      aria-live="polite"
    >
      <m.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-card w-full max-w-sm rounded-lg shadow-2xl"
      >
        <div className="flex flex-col items-center justify-center gap-6 p-8">
          <div className="relative size-16">
            <m.div
              className="border-primary absolute inset-0 rounded-full border-4 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <m.div
              className="border-primary absolute inset-2 rounded-full border-3 border-t-transparent"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <m.div
              className="border-primary absolute inset-4 rounded-full border-2 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <m.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-center text-lg font-medium"
          >
            {text}
          </m.p>
        </div>
      </m.div>
    </m.div>
  );
};

export default LoadingOverlay;
