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
      <Button variant="outline" size="icon" disabled className={className}>
        <Sun className="size-5" />
      </Button>
    );
  }
  return (
    <div className={className}>
      {theme === "light" ? (
        <Button
          variant="outline"
          size="icon"
          onClick={() => changeTheme("dark")}
          className={cn("border-0 bg-transparent!", className)}
        >
          <Sun className="size-5" />
          <span className="sr-only">Toggle dark theme</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={() => changeTheme("light")}
          className={cn("rounded-lg border-0", className)}
        >
          <Moon className="size-5 rotate-270 transition-all" />
          <span className="sr-only">Toggle light theme</span>
        </Button>
      )}
    </div>
  );
}
