import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalPanelHeaderProps } from "@/lib/types/components/shared/overlays";

export function ModalPanelHeader({
  title,
  subtitle,
  onClose,
}: ModalPanelHeaderProps) {
  return (
    <div className="border-border bg-muted/30 flex items-center justify-between border-b px-8 py-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-foreground text-xl font-bold">{title}</h2>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
      </div>
      <Button
        type="button"
        onClick={onClose}
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
