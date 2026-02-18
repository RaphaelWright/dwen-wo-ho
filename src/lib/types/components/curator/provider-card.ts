import { Provider } from "@/lib/types/provider";

export interface ProviderCardProps {
  provider: Provider;
  onViewDetails: (email: string) => void;
  onShowApproveModal: (email: string) => void;
  onShowRejectModal: (email: string) => void;
  isModerating?: boolean;
  currentAction?: "approving" | "rejecting" | null;
  moderatingProviderEmail?: string | null;
}
