import type { ChangeEvent, RefObject } from "react";
import type { School } from "@/lib/types/school";

export interface LockInItem {
  id: string;
  value: string;
}

export interface IconPreviewPanelProps {
  photoPreview: string | null;
  name: string;
  slogan: string;
  rank: number;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handlePhotoSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedSchool: School | null;
  firstCampus: string;
  lockIns: LockInItem[];
  newLockInInput: string;
  setNewLockInInput: (value: string) => void;
  handleAddLockIn: () => void;
  handleUpdateLockIn: (id: string, value: string) => void;
  handleRemoveLockIn: (id: string) => void;
}

export interface IconFormFieldsProps {
  name: string;
  setName: (value: string) => void;
  slogan: string;
  setSlogan: (value: string) => void;
  rank: number;
  setRank: (value: number) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handlePhotoSelect: (event: ChangeEvent<HTMLInputElement>) => void;
}
