import { CheckCircle, XCircle } from "lucide-react";
import { ProviderStatusDisplayProps } from "@/lib/types/components/curator/provider-details";

export function ProviderStatusDisplay({
  status,
  updatedAt,
}: ProviderStatusDisplayProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-6 text-center">
        <div className="flex justify-center mb-4">
          {status === "APPROVED" ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Provider {status === "APPROVED" ? "Approved" : "Rejected"}
        </h2>
        <p className="text-gray-600">
          This provider has been{" "}
          {status === "APPROVED" ? "approved" : "rejected"}
          {updatedAt ? ` on ${new Date(updatedAt).toLocaleDateString()}` : ""}
        </p>
      </div>
    </div>
  );
}
