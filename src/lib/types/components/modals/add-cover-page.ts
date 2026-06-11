import type {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  RefObject,
  SetStateAction,
} from "react";
import type { ColorOption } from "@/lib/types/modals";

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
