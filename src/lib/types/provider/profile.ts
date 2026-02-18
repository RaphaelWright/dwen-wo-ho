import { Provider } from "@/lib/types/provider";

export interface ProviderProfile extends Provider {
  schools?: any[]; // TODO: Define School type if available
  partners?: any[]; // TODO: Define Partner type if available
}

export interface ProviderStats {
  schools: number;
  partners: number;
  totalStudents: number;
  pendingStudents: number;
}

export interface ProviderProfileCardProps {
  provider: ProviderProfile;
}

export interface ProviderStatsGridProps {
  stats: ProviderStats;
}
