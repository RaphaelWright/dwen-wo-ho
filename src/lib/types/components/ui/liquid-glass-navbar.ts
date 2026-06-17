import type { ReactNode } from "react";

/** A single tab item in the liquid glass navbar. */
export interface GlassNavTab {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number | null;
  isAvatar?: boolean;
  avatarContent?: ReactNode;
  onAction?: () => void;
}
