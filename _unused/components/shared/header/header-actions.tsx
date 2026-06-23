"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { AlignRight, X } from "lucide-react";
import { useHeaderActions } from "@/_unused/hooks/header/use-header-actions";

export const HeaderActions = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const { handleGetStarted } = useHeaderActions();

  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <Button onClick={() => setIsOpen(!isOpen)} className="p-2 lg:hidden">
        {isOpen ? <X size={24} /> : <AlignRight size={24} />}
      </Button>
      <Button
        onClick={handleGetStarted}
        className="hidden h-9 rounded-full px-5 lg:flex"
      >
        Get Started
      </Button>
    </div>
  );
};
