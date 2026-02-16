import { ColorOption } from "@/lib/types/modals";

export const COVER_PAGE_COLORS: ColorOption[] = [
  { hex: "faf5f9", name: "Soft Lavender" },
  { hex: "ecf1f9", name: "Light Blue" },
  { hex: "f6f9e6", name: "Pale Green" },
  { hex: "fcf1e9", name: "Peach" },
  { hex: "2b3990", name: "Deep Blue" },
  { hex: "ed1c24", name: "Red" },
  { hex: "955aa4", name: "Purple" },
  { hex: "2bb673", name: "Green" },
];

export const COVER_PAGE_CONSTANTS = {
  EDIT_FRAME_ASPECT: 16 / 9,
  MIN_SCALE: 0.2,
  MAX_SCALE: 3,
  SCALE_STEP: 0.15,
};
