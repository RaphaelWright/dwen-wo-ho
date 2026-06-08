import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { SchoolEditFooterProps } from "@/lib/types/components/modals/school-edit";

export const SchoolEditFooter = ({
  handleDisable,
  isPending,
  hasChanges,
}: SchoolEditFooterProps) => {
  return (
    <div className="px-8 py-6 border-t border-border bg-muted/40 flex justify-between items-center">
      <Button
        type="button"
        onClick={handleDisable}
        variant="ghost"
        className="px-6 font-medium text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center gap-2"
      >
        <Ban className="w-4 h-4" />
        Disable School
      </Button>
      <LoadingButton
        type="submit"
        form="school-edit-form"
        loading={isPending}
        loadingText="Updating..."
        disabled={!hasChanges}
        className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Update School
      </LoadingButton>
    </div>
  );
};
