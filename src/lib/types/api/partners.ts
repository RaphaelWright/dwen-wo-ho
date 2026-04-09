export interface PartnerResponse {
  id: string;
  name: string;
  nickname?: string;
  slogan?: string;
  logo?: string;
  createdAt?: string;
}

export interface PartnerSchoolsResponse {
  partnerId: string;
  schools: import("./providers").ProviderAssociatedSchool[];
}

export interface PartnerProvidersResponse {
  partnerId: string;
  providers: import("./providers").ProviderAssociatedPartner[];
}

export interface CreatePartnerRequest {
  name: string;
  nickname?: string;
  slogan?: string;
  logo?: File | null;
}
