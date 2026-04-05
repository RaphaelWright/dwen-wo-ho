export interface School {
  id: number | string;
  name: string;
  nickname?: string;
  logo?: string;
  type?: string;
  motto?: string;
  totalPatients?: number;
  campuses?: string[] | null;
  createdAt?: string;
  // Extras
  isLoading?: boolean;
  studentCount?: number;
  latestLockInDate?: string;
  newPatientName?: string;
}

export interface SchoolFormData {
  name: string;
  nickname: string;
  motto: string;
  campuses: string[];
  type: string;
  logo: File | undefined;
}

export interface ICreateSchool {
  name: string;
  nickname: string;
  type: string;
  baseline: string;
  motto: string;
  campuses: string[];
  logo: File | null;
}

export interface IUpdateSchool {
  id: string | number;
  name?: string;
  nickname?: string;
  type?: string;
  baseline?: string;
  motto?: string;
  campuses?: string[];
  logo?: File | null;
}

export interface SchoolIcon {
  id: string;
  photo: File | string;
  photoPreview: string;
  name: string;
  slogan: string;
  rank: number;
  schoolId: number | string | null;
  lockIns: string[];
}

export interface Partner {
  id: string;
  name: string;
  nickname: string;
  slogan: string;
  logo: string;
}

export interface SchoolReach {
  schoolName: string;
  reach: number;
}
