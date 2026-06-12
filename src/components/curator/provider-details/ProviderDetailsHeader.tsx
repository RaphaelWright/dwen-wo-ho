import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { ProviderDetailsHeaderProps } from "@/lib/types/components/curator/provider-details";

export function ProviderDetailsHeader({
  status,
  statusColor,
  onBackClick,
}: ProviderDetailsHeaderProps) {
  return (
    <div className="bg-card border-border border-b shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBackClick}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Providers</span>
            </Button>
            <Logo />
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`rounded-full border px-3 py-1 text-sm font-medium ${statusColor}`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
