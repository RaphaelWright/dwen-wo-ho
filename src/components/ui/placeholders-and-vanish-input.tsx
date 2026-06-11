"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePlaceholderRotation } from "@/hooks/components/ui/use-placeholder-rotation";
import { useVanishInput } from "@/hooks/components/ui/use-vanish-input";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  className,
  submitButton,
  value,
  autoFocus,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string; // Allow custom classes for the container
  value?: string; // Add support for controlled external value
  autoFocus?: boolean;
  submitButton?:
    | React.ReactNode
    | ((props: { value: string }) => React.ReactNode); // Allow replacing the default button with access to value
}) {
  const [internalValue, setInternalValue] = useState("");
  const currentPlaceholder = usePlaceholderRotation(placeholders.length);
  const { canvasRef, inputRef, animating, vanishAndSubmit } = useVanishInput({
    value,
    internalValue,
    setInternalValue,
  });

  // Sync with external value if provided
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, inputRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      vanishAndSubmit();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    vanishAndSubmit();
    onSubmit(e);
  };
  return (
    <form
      className={cn(
        "w-full relative max-w-xl mx-auto bg-white dark:bg-zinc-800 h-12 rounded-xl overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
        internalValue && "bg-gray-50",
        className,
      )}
      onSubmit={handleSubmit}
    >
      <canvas
        className={cn(
          "absolute pointer-events-none  text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20",
          !animating ? "opacity-0" : "opacity-100",
        )}
        ref={canvasRef}
      />
      <input
        aria-label="Search"
        onChange={(e) => {
          if (!animating) {
            setInternalValue(e.target.value);
            onChange(e);
          }
        }}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={internalValue}
        type="text"
        className={cn(
          "w-full relative text-sm sm:text-base border-none h-full rounded-xl focus:outline-none focus:ring-0 pl-2 sm:pl-4 pr-20",
          animating && "text-transparent dark:text-transparent",
        )}
      />

      {submitButton ? (
        typeof submitButton === "function" ? (
          submitButton({ value: internalValue })
        ) : (
          submitButton
        )
      ) : (
        <button
          disabled={!internalValue}
          type="submit"
          aria-label="Submit"
          className="absolute right-1 top-1/2  -translate-y-1/2 size-8  rounded-full bg-foreground disabled:bg-muted/80 text-background disabled:text-muted-foreground/50 transition duration-300 flex items-center justify-center"
        >
          <m.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <m.path
              d="M5 12l14 0"
              initial={{
                strokeDasharray: "50%",
                strokeDashoffset: "50%",
              }}
              animate={{
                strokeDashoffset: internalValue ? 0 : "50%",
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
            />
            <path d="M13 18l6 -6" />
            <path d="M13 6l6 6" />
          </m.svg>
        </button>
      )}

      <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          {!internalValue && (
            <m.p
              initial={{
                y: 5,
                opacity: 0,
              }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -15,
                opacity: 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="dark:text-zinc-500 text-sm font-normal text-neutral-500 pl-6 sm:pl-8 text-left w-[calc(100%-2rem)] truncate"
            >
              {placeholders[currentPlaceholder]}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
