import { FiX } from "react-icons/fi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProviderHeaderProps } from "@/lib/types/components/modals/provider-details";

export const ProviderHeader = ({
  provider,
  onClose,
  statusConfig,
}: ProviderHeaderProps) => {
  return (
    <div className="relative bg-muted/80 p-6 flex items-center gap-6 border-b border-border">
      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute top-4 right-4 w-10 h-10 bg-muted/80 hover:bg-destructive/5 backdrop-blur-sm text-muted-foreground hover:text-foreground rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90 p-0 border border-border/50"
        aria-label="Close modal"
      >
        <FiX className="w-5 h-5 text-destructive" />
      </Button>

      <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-card shadow-lg shrink-0 bg-muted">
        <Image
          src={provider?.profilePhotoURL ?? "/auth/lawyer.jpg"}
          alt={provider?.fullName ?? "Provider"}
          width={96}
          height={96}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-foreground flex-1">
        <h2 className="text-2xl font-bold mb-1 text-foreground">
          {provider?.fullName ?? "Provider"}
        </h2>
        {provider?.professionalTitle && (
          <p className="text-muted-foreground text-sm mb-2">
            {provider.professionalTitle}
          </p>
        )}
        {statusConfig && (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
          >
            {provider.applicationStatus}
          </span>
        )}
      </div>
    </div>
  );
};
