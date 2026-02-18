import { Button } from "@/components/ui/button";
import { SchoolHeaderProps } from "@/lib/types/components/modals/school-creation";
import { X } from "lucide-react";

export const SchoolHeader = ({
  currentStep,
  handleClose,
}: SchoolHeaderProps) => {
  return (
    <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {currentStep === 1 ? "New School" : "Review School Details"}
          </h2>
          <p className="text-sm text-gray-500">
            {currentStep === 1
              ? "Add a new educational institution"
              : "Review and confirm school information"}
          </p>
        </div>
      </div>
      <Button
        onClick={handleClose}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
