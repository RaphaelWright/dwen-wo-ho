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
  primaryColor?: string;
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
