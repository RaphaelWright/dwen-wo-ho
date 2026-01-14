export interface ProviderDetails {
  id: string;
  email: string;
  fullName: string;
  professionalTitle?: string | null;
  status?: string;
  officePhoneNumber?: string | null;
  specialties?: string[];
  profileImage?: string | null;
  createdAt: string;
  updatedAt: string;
  applicationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  applicationDate?: string;
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
