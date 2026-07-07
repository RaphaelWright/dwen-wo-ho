"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { useHydrated } from "@/hooks/shared/use-hydrated";

import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useHydrated();

  function changeTheme(next: string) {
    const startViewTransition =
      typeof document !== "undefined"
        ? document.startViewTransition?.bind(document)
        : undefined;

    if (startViewTransition) {
      startViewTransition(() => setTheme(next));
      return;
    }

    setTheme(next);
  }

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        className={cn(
          "border-border bg-background text-foreground rounded-full",
          className,
        )}
      >
        <Sun className="size-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => changeTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "border-border bg-background text-foreground hover:bg-muted rounded-full transition-colors",
        className,
      )}
      aria-label={
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      }
    >
      {theme === "light" ? (
        <Sun className="size-5" aria-hidden="true" />
      ) : (
        <Moon className="size-5" aria-hidden="true" />
      )}
    </Button>
  );
}
