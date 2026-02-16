import { StepIndicatorProps } from "@/lib/types/components/modals/school-creation";
import { Check } from "lucide-react";

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="px-8 py-4 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-2 ${
            currentStep >= 1 ? "text-[#955aa4]" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStep >= 1
                ? "bg-[#955aa4] text-white"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
          </div>
          <span className="text-sm font-medium">Form</span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200">
          <div
            className={`h-full transition-all duration-300 ${
              currentStep >= 2 ? "bg-[#955aa4]" : "bg-gray-200"
            }`}
          />
        </div>
        <div
          className={`flex items-center gap-2 ${
            currentStep >= 2 ? "text-[#955aa4]" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStep >= 2
                ? "bg-[#955aa4] text-white"
                : "bg-gray-200 text-gray-400"
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
