import { AssociatedSchool, AssociatedPartner } from "./partners";

export interface Provider {
  id: string;
  email: string;
  providerName?: string;
  providerTitle?: string | null;
  specialty?: string | null;
  officePhoneNumber?: string | null;
  applicationDate?: string;
  applicationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  profilePhotoURL?: string | null;
  status?: string | null;
  bio?: string | null;
  lastActive?: string;
  ranking?: string;
}


export interface ProviderDetails extends Provider {
  fullName: string;
  professionalTitle?: string | null;
  profileImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
  specialties?: string[];
  schools?: any[];
  partners?: any[];
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



export interface IProviderResponse {
  success: boolean;
  data: Provider[];
  message: string;
}

export interface ApiActionResponse {
  success: boolean;
  message?: string;
  data?: Provider;
}
