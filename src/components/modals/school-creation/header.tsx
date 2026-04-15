import { Button } from "@/components/ui/button";
import { SchoolHeaderProps } from "@/lib/types/components/modals/school-creation";
import { X } from "lucide-react";

export const SchoolHeader = ({
  currentStep,
  handleClose,
}: SchoolHeaderProps) => {
  return (
    <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/30">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {currentStep === 1 ? "New School" : "Review School Details"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {currentStep === 1
              ? "Add a new educational institution"
              : "Review and confirm school information"}
          </p>
        </div>
      </div>
      <Button
        onClick={handleClose}
        variant="outline"
        size="icon"
        className="w-8 h-8 rounded-full"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
