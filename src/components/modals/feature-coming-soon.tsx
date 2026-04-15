import { X, Clock } from "lucide-react";

import { FeatureComingSoonModalProps } from "@/lib/types/modals";

import { FEATURE_COMING_SOON_CONTENT } from "@/lib/constants/components/modals/feature-coming-soon";
import { Button } from "../ui/button";

const FeatureComingSoonModal = ({
  isOpen,
  onClose,
  featureName,
}: FeatureComingSoonModalProps) => {
  if (!isOpen) return null;

  const { TITLE, DESCRIPTION_PREFIX, DESCRIPTION_SUFFIX, BUTTON_TEXT } =
    FEATURE_COMING_SOON_CONTENT;

  return (
    <div className="fixed inset-0 backdrop-blur-3xl bg-background/80 flex items-center justify-center z-60 p-4">
      <div
        className="relative bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col items-center text-center p-8 border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={onClose}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 w-8 h-8 rounded-full"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-primary" />
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-2">{TITLE}</h3>

        <p className="text-muted-foreground mb-6">
          {DESCRIPTION_PREFIX}{" "}
          <span className="font-semibold text-primary">{featureName}</span>{" "}
          {DESCRIPTION_SUFFIX}
        </p>

        <Button
          onClick={onClose}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          {BUTTON_TEXT}
        </Button>
      </div>
    </div>
  );
};

export default FeatureComingSoonModal;
