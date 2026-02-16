"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { AlignRight, X } from "lucide-react";
import { useHeaderActions } from "@/hooks/components/shared/use-header-actions";

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
      <Button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
        {isOpen ? <X size={24} /> : <AlignRight size={24} />}
      </Button>
      <Button
        onClick={handleGetStarted}
        className="hidden lg:flex rounded-full h-9 px-5"
      >
        Get Started
      </Button>
    </div>
  );
};
