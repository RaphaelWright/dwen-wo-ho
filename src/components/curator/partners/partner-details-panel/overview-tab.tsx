import { OverviewTabProps } from "@/lib/types/components/curator/partners/partner-details-panel";

export const OverviewTab = ({ partner }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      {partner?.slogan && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-500">Slogan</h3>
          <p className="text-lg text-gray-900 italic">
            &quot;{partner.slogan}&quot;
          </p>
        </div>
      )}
    </div>
  );
};
