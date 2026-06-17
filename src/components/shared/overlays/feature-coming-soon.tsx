import { X, Clock } from "lucide-react";

import { FeatureComingSoonOverlayProps } from "@/lib/types/components/shared/overlays";

import { FEATURE_COMING_SOON_CONTENT } from "@/lib/constants/components/shared/overlays";
import { Button } from "@/components/ui/button";

const FeatureComingSoonOverlay = ({
  isOpen,
  onClose,
  featureName,
}: FeatureComingSoonOverlayProps) => {
  if (!isOpen) return null;

  const { TITLE, DESCRIPTION_PREFIX, DESCRIPTION_SUFFIX, BUTTON_TEXT } =
    FEATURE_COMING_SOON_CONTENT;

  return (
    <div className="bg-background/80 fixed inset-0 z-60 flex items-center justify-center p-4 backdrop-blur-3xl">
      <div
        className="bg-card text-foreground border-border relative flex w-full max-w-md flex-col items-center overflow-hidden rounded-2xl border p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={onClose}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8 rounded-full"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <Clock className="text-primary h-10 w-10" />
        </div>

        <h3 className="text-foreground mb-2 text-2xl font-bold">{TITLE}</h3>

        <p className="text-muted-foreground mb-6">
          {DESCRIPTION_PREFIX}{" "}
          <span className="text-primary font-semibold">{featureName}</span>{" "}
          {DESCRIPTION_SUFFIX}
        </p>

        <Button
          onClick={onClose}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 rounded-lg px-6 py-2.5 font-semibold shadow-lg transition-colors"
        >
          {BUTTON_TEXT}
        </Button>
      </div>
    </div>
  );
};

export default FeatureComingSoonOverlay;
