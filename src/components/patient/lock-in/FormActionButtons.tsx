import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { FormActionButtonsProps } from "@/lib/types/components/patient/lock-in";
import { LOCK_IN_TEXTS } from "@/lib/constants/components/patient/lock-in";

export function FormActionButtons({
  isSubmitting,
  onCancel,
}: FormActionButtonsProps) {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        {LOCK_IN_TEXTS.buttons.cancel}
      </Button>
      <LoadingButton
        type="submit"
        loading={isSubmitting}
        loadingText={LOCK_IN_TEXTS.buttons.submitting}
        className="bg-primary hover:bg-primary/90"
      >
        {LOCK_IN_TEXTS.buttons.submit}
      </LoadingButton>
    </div>
  );
}
