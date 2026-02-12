"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

interface LockInHeaderProps {
  onBack: () => void;
}

export function LockInHeader({ onBack }: LockInHeaderProps) {
  return (
    <div className="mb-8">
      <Button onClick={onBack} variant="ghost" className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Schools
      </Button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lock In Form
          </h1>
          <p className="text-gray-600">Please fill out the form below</p>
        </div>
        <Logo />
      </div>
    </div>
  );
}
