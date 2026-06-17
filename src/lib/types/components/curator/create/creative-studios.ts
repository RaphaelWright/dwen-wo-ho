import type { ChangeEvent, ReactNode, RefObject } from "react";
import type { LucideIcon } from "lucide-react";

export type CreativeStudiosType = "campus" | "provider" | "programme" | "tag";

export type CreativeStudiosStep = 1 | 2;

export interface CampusDraft {
  name: string;
  nicks: string[];
  motto: string;
  type: string;
  loc: string;
  logoUrl: string | null;
  photoUrl: string | null;
}

export type CampusImageFieldKey = "logoUrl" | "photoUrl";

export interface CampusImageUploadFieldConfig {
  field: CampusImageFieldKey;
  id: string;
  label: string;
  variant: "logo" | "banner";
}

export interface CampusImageUploadFieldProps {
  id: string;
  label: string;
  previewUrl: string | null;
  error: string;
  variant: "logo" | "banner";
  inputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export interface CampusStep1SelectFieldConfig {
  name: "type" | "loc";
  id: string;
  label: string;
  placeholder: string;
  optionsKey: "type" | "loc";
}

export interface CampusStep1TextFieldConfig {
  name: "name" | "motto";
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
}

export type CampusStep1FormSection =
  | ({ kind: "text" } & CampusStep1TextFieldConfig)
  | { kind: "nicks" }
  | ({ kind: "select" } & CampusStep1SelectFieldConfig);

export interface ProviderDraft {
  name: string;
  nicks: string[];
  bio: string;
  clin: boolean;
  photoUrl: string | null;
}

export type ProviderImageFieldKey = "photoUrl";

export interface ProviderImageUploadFieldConfig {
  field: ProviderImageFieldKey;
  id: string;
  label: string;
  variant: "banner";
}

export interface ProgrammeDraft {
  name: string;
  nicks: string[];
  bio: string;
  df: number;
  dt: number;
  coverUrl: string | null;
}

export type ProgrammeImageFieldKey = "coverUrl";

export interface ProgrammeImageUploadFieldConfig {
  field: ProgrammeImageFieldKey;
  id: string;
  label: string;
  variant: "banner";
}

export interface TagDraft {
  title: string;
  tags: string[];
}

export interface PreviewPanelProps {
  name: string;
  nick?: string;
  type?: string;
  loc?: string;
  motto?: string;
  showLogo?: boolean;
  logoUrl?: string | null;
  photoUrl?: string | null;
}

export interface CampusRecord {
  name: string;
  nicks: string[];
  motto?: string;
  type?: string;
  loc?: string;
}

export interface ProviderRecord {
  name: string;
  nicks: string[];
  bio?: string;
  clin?: boolean;
}

export interface ProgrammeRecord {
  name: string;
  nicks: string[];
  bio?: string;
  df: number;
  dt: number;
}

export interface TagRecord {
  title: string;
}

export interface CreativeStudiosMockRecords {
  campuses: CampusRecord[];
  providers: ProviderRecord[];
  programmes: ProgrammeRecord[];
  tags: TagRecord[];
}

export interface CreativeStudiosFlowContextValue {
  type: CreativeStudiosType;
  campus: CampusDraft;
  provider: ProviderDraft;
  programme: ProgrammeDraft;
  tag: TagDraft;
  preview: PreviewPanelProps;
  updateCampus: (partial: Partial<CampusDraft>) => void;
  updateProvider: (partial: Partial<ProviderDraft>) => void;
  updateProgramme: (partial: Partial<ProgrammeDraft>) => void;
  updateTag: (partial: Partial<TagDraft>) => void;
  submitCampus: () => void;
  submitProvider: () => void;
  submitProgramme: () => void;
  submitTag: () => void;
  resetDrafts: () => void;
}

export interface CreativeStudiosDashboardCard {
  label: string;
  type: CreativeStudiosType;
  count: number;
  icon: LucideIcon;
  color: string;
  desc: string;
}

export interface CreativeStudiosBackButtonProps {
  onClick: () => void;
  label?: string;
}

export interface CreativeStudiosHomeButtonProps {
  onClick: () => void;
}

export interface CreativeStudiosChipProps {
  label: string;
  color: "purple" | "gray";
  onRemove: () => void;
}

export interface CreativeStudiosErrorMsgProps {
  msg: string;
}

export interface CreativeStudiosFlowProviderProps {
  type: CreativeStudiosType;
  children: ReactNode;
}

export interface CreativeStudiosWizardShellProps {
  type: CreativeStudiosType;
  children: ReactNode;
}

export interface CreativeStudiosFlowColumnProps {
  type: CreativeStudiosType;
  children: ReactNode;
}

export interface CreativeStudiosWizardPreviewProps {
  type: CreativeStudiosType;
}

export interface ProviderClinicalToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}
