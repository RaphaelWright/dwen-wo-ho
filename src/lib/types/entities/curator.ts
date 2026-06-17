export interface CoverPage {
  id: string;
  photo: File | string;
  photoPreview: string;
  color: string;
  slogan: string;
  schoolId: number | string | null;
}
