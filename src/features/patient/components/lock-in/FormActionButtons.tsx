"use client";

import { Button } from "@/components/ui/button";

interface FormActionButtonsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export function FormActionButtons({
  isSubmitting,
  onCancel,
}: FormActionButtonsProps) {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#955aa4] hover:bg-[#955aa4]/90"
      >
        {isSubmitting ? "Submitting..." : "Submit Lock In"}
      </Button>
    </div>
  );
}
