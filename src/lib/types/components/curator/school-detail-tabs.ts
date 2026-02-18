import { SchoolProvider } from "@/lib/types/provider";
import { School, Partner, SchoolReach } from "@/lib/types/school";

export interface OverviewTabProps {
  school: School;
}

export interface ProvidersTabProps {
  providers: SchoolProvider[];
  isLoading: boolean;
  onProviderClick: (provider: SchoolProvider) => void;
}

export interface PartnersTabProps {
  partners: Partner[];
  isLoading: boolean;
}

export interface ReachTabProps {
  reach?: SchoolReach | null;
  isLoading: boolean;
}
