export interface LockIn2Achievement {
  text: string;
  emoji: string;
}

export interface LockIn2PhotoStyle {
  left: string;
  top: string;
  width?: string;
  height?: string;
  transform?: string;
  filter?: string;
}

export interface LockIn2Character {
  headline: string;
  name: string;
  factPrefix: string;
  factHighlight: string;
  factSuffix: string;
  achievements: LockIn2Achievement[];
  photo: string;
  photoStyle: LockIn2PhotoStyle;
}

export interface LockIn2AchievementSlot {
  id: number;
  top: number;
  emoji: string;
  text: string;
}

export interface LockIn2AchievementCardProps {
  slot: LockIn2AchievementSlot;
  status?: "idle" | "active" | "passive";
}
