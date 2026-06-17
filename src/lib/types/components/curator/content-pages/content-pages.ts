import type {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  RefObject,
  SetStateAction,
} from "react";
import type { School, SchoolIcon } from "@/lib/types/entities/school";
import type { CoverPage } from "@/lib/types/entities/curator";
import type { ColorOption } from "@/lib/types/components/shared/overlays";

export interface ContentPagesWorkspaceProps<TPages = unknown> {
  pages: TPages;
}

export interface ContentPagesOverlayHostProps<TPages = unknown> {
  pages: TPages;
}

export interface CoverPageTabProps {
  coverPages: CoverPage[];
  onCoverPageClick: (page: CoverPage) => void;
  onAddCoverPage: () => void;
}

export interface ContentPagesIconsTabProps {
  icons: SchoolIcon[];
  onIconClick: (icon: SchoolIcon) => void;
  onAddIcon: () => void;
}

export interface SchoolSelectorButtonProps {
  selectedSchoolName?: string;
  onOpenSchoolModal: () => void;
}

export interface LockInItem {
  id: string;
  value: string;
}

export interface AddIconPreviewPanelProps {
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

export interface AddIconFormFieldsProps {
  name: string;
  setName: (value: string) => void;
  slogan: string;
  setSlogan: (value: string) => void;
  rank: number;
  setRank: (value: number) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handlePhotoSelect: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface CoverPhotoColorStepProps {
  photoPreview: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handlePhotoSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  colorDropdownRef: RefObject<HTMLDivElement | null>;
  showColorDropdown: boolean;
  setShowColorDropdown: Dispatch<SetStateAction<boolean>>;
  selectedColor: string;
  handleColorSelect: (color: ColorOption) => void;
}

export interface CoverEditImageStepProps {
  photoPreview: string;
  editorContainerRef: RefObject<HTMLDivElement | null>;
  editorImageRef: RefObject<HTMLImageElement | null>;
  handleEditorImageLoad: () => void;
  isDragging: boolean;
  handlePanStart: (event: MouseEvent) => void;
  handlePanMove: (event: MouseEvent) => void;
  handlePanEnd: () => void;
  scale: number;
  setScale: Dispatch<SetStateAction<number>>;
  rotation: number;
  setRotation: Dispatch<SetStateAction<number>>;
  posX: number;
  posY: number;
  setFitToFrame: () => void;
}

export interface CoverSloganStepProps {
  slogan: string;
  setSlogan: Dispatch<SetStateAction<string>>;
  selectedColor: string;
  photoPreview: string | null;
}
