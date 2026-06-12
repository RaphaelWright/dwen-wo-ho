import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { LockInHeaderProps } from "@/lib/types/components/patient/lock-in";
import { LOCK_IN_TEXTS } from "@/lib/constants/components/patient/lock-in";

export function LockInHeader({ onBack }: LockInHeaderProps) {
  return (
    <div className="mb-8">
      <Button onClick={onBack} variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Schools
      </Button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {LOCK_IN_TEXTS.header.title}
          </h1>
          <p className="text-gray-600">{LOCK_IN_TEXTS.header.subtitle}</p>
        </div>
        <Logo />
      </div>
    </div>
  );
}
