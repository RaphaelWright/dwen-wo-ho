import { StepIndicatorProps } from "@/lib/types/components/modals/school-creation";
import { Check } from "lucide-react";

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="px-8 py-4 border-b border-border bg-card">
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-2 ${
            currentStep >= 1 ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStep >= 1
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
          </div>
          <span className="text-sm font-medium">Form</span>
        </div>
        <div className="flex-1 h-0.5 bg-muted">
          <div
            className={`h-full transition-all duration-300 ${
              currentStep >= 2 ? "bg-primary" : "bg-muted"
            }`}
          />
        </div>
        <div
          className={`flex items-center gap-2 ${
            currentStep >= 2 ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStep >= 2
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
          <span className="text-sm font-medium">Preview</span>
        </div>
      </div>
    </div>
  );
};
