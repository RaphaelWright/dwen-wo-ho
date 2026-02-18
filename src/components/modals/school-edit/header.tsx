import { Button } from "@/components/ui/button";
import { SchoolEditHeaderProps } from "@/lib/types/components/modals/school-edit";
import { X } from "lucide-react";

export const SchoolEditHeader = ({ onClose }: SchoolEditHeaderProps) => {
  return (
    <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/40">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Edit School</h2>
          <p className="text-sm text-muted-foreground">
            Update school information
          </p>
        </div>
      </div>
      <Button
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
