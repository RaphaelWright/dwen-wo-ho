export type Landing2Emoji = string;

export interface Landing2Achievement {
  text: string;
  emoji: string;
}

export interface Landing2PhotoStyle {
  left: string;
  top: string;
  width?: string;
  height?: string;
  transform?: string;
  filter?: string;
}

export interface Landing2Character {
  headline: string;
  name: string;
  factPrefix: string;
  factHighlight: string;
  factSuffix: string;
  achievements: Landing2Achievement[];
  photo: string;
  photoStyle: Landing2PhotoStyle;
}

export interface Landing2AchievementSlot {
  id: number;
  top: number;
  emoji: Landing2Emoji;
  text: string;
}
