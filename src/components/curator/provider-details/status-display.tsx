import { CheckCircle, XCircle } from "lucide-react";
import { ProviderStatusDisplayProps } from "@/lib/types/components/curator/provider-details/provider-details";

export function ProviderStatusDisplay({
  status,
  updatedAt,
}: ProviderStatusDisplayProps) {
  return (
    <div className="bg-card border-border overflow-hidden rounded-lg border shadow-lg">
      <div className="px-6 py-6 text-center">
        <div className="mb-4 flex justify-center">
          {status === "APPROVED" ? (
            <CheckCircle className="text-success h-16 w-16" />
          ) : (
            <XCircle className="text-destructive h-16 w-16" />
          )}
        </div>
        <h2 className="text-foreground mb-2 text-xl font-bold">
          Provider {status === "APPROVED" ? "Approved" : "Rejected"}
        </h2>
        <p className="text-muted-foreground">
          This provider has been{" "}
          {status === "APPROVED" ? "approved" : "rejected"}
          {updatedAt ? ` on ${new Date(updatedAt).toLocaleDateString()}` : ""}
        </p>
      </div>
    </div>
  );
}
