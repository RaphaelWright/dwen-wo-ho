import { PROVIDER_PROFILE_SUB_STEPS } from "@/lib/constants/components/provider/auth/signup-footer";
import { ProfileStepIndicatorProps } from "@/lib/types/components/provider/auth/signup-footer";
import { cn } from "@/lib/utils";

export function ProfileStepIndicator({
  currentStep,
}: ProfileStepIndicatorProps) {
  return (
    <div
      className="flex items-center justify-center gap-3 sm:gap-5"
      aria-label="Profile setup progress"
    >
      {PROVIDER_PROFILE_SUB_STEPS.map((step) => {
        const isActive = currentStep >= step.index;

        return (
          <div
            key={step.index}
            className="flex shrink-0 items-center gap-1.5 sm:gap-2"
          >
            <div
              className={cn(
                "size-2 rounded-full sm:size-2.5",
                isActive ? "bg-primary" : "bg-muted-foreground/30",
              )}
            />
            <span
              className={cn(
                "text-xs font-medium whitespace-nowrap sm:text-sm",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
