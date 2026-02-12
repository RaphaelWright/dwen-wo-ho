export interface ProviderDetails {
  id: string;
  email: string;
  fullName: string;
  providerTitle?: string | null;
  professionalTitle?: string | null;
  status?: string;
  officePhoneNumber?: string | null;
  specialties?: string[];
  profileImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
  applicationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  applicationDate?: string;
  bio?: string | null;
  providerName?: string; // Sometimes used instead of fullName in API responses
}

export interface Provider {
  id?: string;
  email: string;
  providerName: string;
  providerTitle?: string | null;
  specialty?: string | null;
  officePhoneNumber?: string | null;
  applicationDate: string;
  applicationStatus: "PENDING" | "APPROVED" | "REJECTED";
  profilePhotoURL?: string | null;
  status?: string | null;
  bio?: string | null;
  lastActive?: string;
}

export interface SchoolProvider {
  id: string;
  email: string;
  providerName: string;
  providerTitle: string;
  specialty: string;
  officePhoneNumber: string;
  profilePhotoURL: string;
  applicationStatus: string;
  isAssociated: boolean;
}

export interface AssociatedSchool {
  id: string;
  name: string;
  joinedDate?: string;
  isAssociated: boolean;
  logo?: string;
}

export interface AssociatedPartner {
  id: string;
  name: string;
  joinedDate?: string;
  isAssociated: boolean;
  logo?: string;
}

export interface IProviderResponse {
  success: boolean;
  data: Provider[];
  message: string;
}


