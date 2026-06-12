import { Button } from "@/components/ui/button";
import { SchoolHeaderProps } from "@/lib/types/components/modals/school-creation";
import { X } from "lucide-react";

export const SchoolHeader = ({
  currentStep,
  handleClose,
}: SchoolHeaderProps) => {
  return (
    <div className="border-border bg-muted/30 flex items-center justify-between border-b px-8 py-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-foreground text-xl font-bold">
            {currentStep === 1 ? "New School" : "Review School Details"}
          </h2>
          <p className="text-muted-foreground text-sm">
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
        className="h-8 w-8 rounded-full"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
