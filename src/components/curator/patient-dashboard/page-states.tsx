import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PatientDetailsErrorViewProps } from "@/lib/types/components/curator/patient-dashboard";

export function PatientDetailsLoadingView() {
  return (
    <div className="bg-muted/5 flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="border-primary mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2" />
        <p className="text-muted-foreground text-sm">
          Loading patient details...
        </p>
      </div>
    </div>
  );
}

export function PatientDetailsErrorView({
  onBack,
}: PatientDetailsErrorViewProps) {
  return (
    <div className="bg-muted/5 flex min-h-screen flex-col items-center justify-center p-6">
      <Button
        type="button"
        onClick={onBack}
        variant="ghost"
        className="text-muted-foreground hover:text-foreground mb-3 flex items-center gap-1 text-sm"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </Button>
      <p className="text-destructive text-sm">Failed to load patient details</p>
    </div>
  );
}
