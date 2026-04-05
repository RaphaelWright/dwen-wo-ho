import { Provider } from "@/lib/types/provider";

export interface ProviderProfile extends Provider {
  schools?: import("@/lib/types/api/providers").AssociatedSchool[];
  partners?: import("@/lib/types/api/providers").AssociatedPartner[];
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
