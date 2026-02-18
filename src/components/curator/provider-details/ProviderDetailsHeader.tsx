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
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBackClick}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Providers</span>
            </Button>
            <Logo />
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColor}`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
