import { Button } from "@/components/ui/button";
import { SchoolEditHeaderProps } from "@/lib/types/components/modals/school-edit";
import { X } from "lucide-react";

export const SchoolEditHeader = ({ onClose }: SchoolEditHeaderProps) => {
  return (
    <div className="border-border bg-muted/40 flex items-center justify-between border-b px-8 py-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-foreground text-xl font-bold">Edit School</h2>
          <p className="text-muted-foreground text-sm">
            Update school information
          </p>
        </div>
      </div>
      <Button
        onClick={onClose}
        className="bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full border transition-all"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
