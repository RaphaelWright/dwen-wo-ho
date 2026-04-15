import { CheckCircle, XCircle } from "lucide-react";
import { ProviderStatusDisplayProps } from "@/lib/types/components/curator/provider-details";

export function ProviderStatusDisplay({
  status,
  updatedAt,
}: ProviderStatusDisplayProps) {
  return (
    <div className="bg-card shadow-lg rounded-lg overflow-hidden border border-border">
      <div className="px-6 py-6 text-center">
        <div className="flex justify-center mb-4">
          {status === "APPROVED" ? (
            <CheckCircle className="w-16 h-16 text-success" />
          ) : (
            <XCircle className="w-16 h-16 text-destructive" />
          )}
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
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
