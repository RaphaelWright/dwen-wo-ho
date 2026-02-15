"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { flushSync } from "react-dom";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  function changeTheme(theme: string) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setTheme(theme);
        });
      });
      return;
    } else {
      setTheme(theme);
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="size-5" />
      </Button>
    );
  }
  return (
    <div>
      {theme === "light" ? (
        <Button
          variant="outline"
          size="icon"
          onClick={() => changeTheme("dark")}
          className="border-0 bg-transparent!"
        >
          <Sun className="size-5" />
          <span className="sr-only">Toggle dark theme</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={() => changeTheme("light")}
        >
          <Moon className="size-5 transition-all" />
          <span className="sr-only">Toggle light theme</span>
        </Button>
      )}
    </div>
  );
}
