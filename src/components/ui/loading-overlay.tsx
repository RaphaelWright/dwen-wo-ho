"use client";

import { motion } from "framer-motion";

interface LoadingOverlayProps {
  text: string;
  isVisible: boolean;
}

const LoadingOverlay = ({ text, isVisible }: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 p-4 backdrop-blur-sm"
      aria-busy="true"
      aria-live="polite"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-sm rounded-lg bg-card shadow-2xl"
      >
        <div className="flex flex-col items-center justify-center gap-6 p-8">
          <div className="relative size-16">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-3 border-primary border-t-transparent"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center text-lg font-medium text-muted-foreground"
          >
            {text}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingOverlay;
