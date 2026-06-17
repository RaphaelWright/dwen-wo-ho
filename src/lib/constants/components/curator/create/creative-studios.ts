import type {
  CampusImageUploadFieldConfig,
  CampusStep1FormSection,
  CreativeStudiosType,
  ProgrammeImageUploadFieldConfig,
  ProviderImageUploadFieldConfig,
} from "@/lib/types/components/curator/create/creative-studios";

export const CREATIVE_STUDIOS_TYPES = [
  "campus",
  "provider",
  "programme",
  "tag",
] as const satisfies readonly CreativeStudiosType[];

export const CREATIVE_STUDIOS_STEP_BOUNDS: Record<
  CreativeStudiosType,
  { min: number; max: number }
> = {
  campus: { min: 1, max: 2 },
  provider: { min: 1, max: 2 },
  programme: { min: 1, max: 2 },
  tag: { min: 1, max: 1 },
};

export const CAMPUS_TYPE_OPTIONS = [
  "High School",
  "Junior High",
  "Senior High",
  "College",
  "University",
] as const;

export const CAMPUS_LOCATION_OPTIONS = [
  "Accra",
  "Kumasi",
  "Tamale",
  "Cape Coast",
  "Takoradi",
  "Ho",
  "Sunyani",
  "Bolgatanga",
  "Koforidua",
  "Wa",
] as const;

export const W52_WEEKS = Array.from({ length: 52 }, (_, i) => i + 1);

export const MOCK_SEED_COUNTS = {
  campuses: 20,
  providers: 16,
  programmes: 4,
  tags: 12,
} as const;

export const CAMPUS_STEP_2_IMAGE_FIELDS = [
  {
    field: "logoUrl",
    id: "campus-logo-upload",
    label: "Logo",
    variant: "logo",
  },
  {
    field: "photoUrl",
    id: "campus-banner-upload",
    label: "Banner Photo",
    variant: "banner",
  },
] as const satisfies readonly CampusImageUploadFieldConfig[];

export const PROVIDER_STEP_2_PHOTO_FIELD = {
  field: "photoUrl",
  id: "provider-photo-upload",
  label: "Photo",
  variant: "banner",
} as const satisfies ProviderImageUploadFieldConfig;

export const PROGRAMME_STEP_2_COVER_FIELD = {
  field: "coverUrl",
  id: "programme-cover-upload",
  label: "Cover",
  variant: "banner",
} as const satisfies ProgrammeImageUploadFieldConfig;

export const CAMPUS_STEP_1_FIELD_LABEL_CLASS =
  "text-foreground text-xs font-semibold";

export const CAMPUS_STEP_1_FIELD_ERROR_CLASS =
  "cs-fade-in text-destructive mt-1.5 flex items-center gap-1 text-[11px] font-medium";

export const CAMPUS_STEP_1_FORM_SECTIONS = [
  {
    kind: "text",
    name: "name",
    id: "campus-name",
    label: "Full Name",
    placeholder: "e.g. Lincoln High School",
    required: true,
  },
  { kind: "nicks" },
  {
    kind: "text",
    name: "motto",
    id: "campus-motto",
    label: "Motto",
    placeholder: "School motto or tagline",
    required: false,
  },
  {
    kind: "select",
    name: "type",
    id: "campus-type",
    label: "Type",
    placeholder: "Select type...",
    optionsKey: "type",
  },
  {
    kind: "select",
    name: "loc",
    id: "campus-loc",
    label: "Location",
    placeholder: "Select location...",
    optionsKey: "loc",
  },
] as const satisfies readonly CampusStep1FormSection[];
