import { TrendingUp } from "lucide-react";
import { TabContentState } from "@/components/shared/tab-content-state";
import { ReachTabProps } from "@/lib/types/components/curator/school-detail-tabs";

export const ReachTab = ({ reach, isLoading }: ReachTabProps) => (
  <TabContentState
    isLoading={isLoading}
    isEmpty={!reach}
    loadingMessage="Loading reach data..."
    emptyMessage="No reach data available"
    EmptyIcon={TrendingUp}
  >
    {reach && (
      <div className="max-w-md mx-auto">
        <div className="bg-linear-to-br from-primary to-primary/80 rounded-2xl p-8 text-center text-primary-foreground">
          <TrendingUp className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Reach</h3>
          <p className="text-5xl font-extrabold mb-2">{reach.reach}</p>
          <p className="text-primary-foreground/80">
            Total reach for {reach.schoolName}
          </p>
        </div>
      </div>
    )}
  </TabContentState>
);
