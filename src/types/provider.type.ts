export interface IProvider {
  providerName: string;
  providerTitle?: string | null;
  email: string;
  specialty: string;
  officePhoneNumber: string;
  applicationDate: string;
  applicationStatus: "PENDING" | "APPROVED" | "REJECTED";
  profilePhotoURL: string;
  status?: string | null;
  bio?: string | null;
}

export interface IProviderResponse {
  success: boolean;
  data: IProvider[];
  message: string;
}
