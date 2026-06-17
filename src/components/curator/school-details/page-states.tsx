import { Button } from "@/components/ui/button";
import type { SchoolDetailsErrorViewProps } from "@/lib/types/components/curator/school-details/school-details";

export function SchoolDetailsLoadingView() {
  return (
    <div className="bg-muted/5 flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="border-primary mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2" />
        <p className="text-muted-foreground text-sm">
          Loading school details...
        </p>
      </div>
    </div>
  );
}

export function SchoolDetailsErrorView({
  error,
  onBack,
}: SchoolDetailsErrorViewProps) {
  return (
    <div className="bg-muted/5 flex min-h-screen flex-col items-center justify-center p-6">
      <Button
        type="button"
        onClick={onBack}
        variant="ghost"
        className="text-muted-foreground hover:text-foreground mb-3"
      >
        ← Back to Schools
      </Button>
      <p className="text-destructive text-sm">{error || "School not found"}</p>
    </div>
  );
}
