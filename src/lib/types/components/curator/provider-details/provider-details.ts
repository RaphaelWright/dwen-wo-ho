import { ProviderDetails } from "@/lib/types/entities/provider";

export interface ProviderActionButtonsProps {
  onApprove: () => void;
  onReject: () => void;
  isLoading: boolean;
}

export interface ProviderDetailsHeaderProps {
  status: string;
  statusColor: string;
  onBackClick: () => void;
}

export interface ProviderProfileCardProps {
  provider: ProviderDetails;
}

export interface ProviderSpecialtiesCardProps {
  specialties: string[];
}

export interface ProviderStatusDisplayProps {
  status: string;
  updatedAt?: string;
}
