export interface Partner {
  id: string | number;
  name: string;
  nickname?: string;
  slogan?: string;
  logo?: string;
  [key: string]: unknown;
}

export interface ICreatePartner {
  name: string;
  nickname?: string;
  slogan?: string;
  logo?: File | null;
}

export interface AssociatedSchool {
  id: string | number;
  name: string;
  logo?: string;
  isAssociated?: boolean;
  joinedDate?: string;
  primaryColor?: string;
}

export interface AssociatedProvider {
  id: string;
  email: string;
  providerName: string;
  providerTitle?: string | null;
  specialty?: string;
  profilePhotoURL?: string;
}

export interface AssociatedPartner {
  id: string | number;
  name: string;
  logo?: string;
  isAssociated?: boolean;
  joinedDate?: string;
}

export interface PartnerDetailsData {
  partner: any;
  associatedSchools: AssociatedSchool[];
  associatedProviders: AssociatedProvider[];
}

export type PartnerDetailsTab = "overview" | "schools" | "providers" | "partners";

export interface UsePartnerSearchProps {
  availableSchools: AssociatedSchool[];
  availableProviders: AssociatedProvider[];
  schoolSearchQuery: string;
  providerSearchQuery: string;
}
