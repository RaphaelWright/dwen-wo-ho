export type ProviderLaunch2PillIconKey = "heart" | "zap" | "handshake";

export type ProviderLaunch2FooterIconKey =
  | "lock"
  | "graduation-cap"
  | "message-circle";

export type ProviderLaunchBubbleMarkupKey = "bubble1" | "bubble2" | "bubble3";

export interface ProviderLaunchShowcaseCard {
  pillTitle: string;
  pillIcon: ProviderLaunch2PillIconKey;
  footerIcon: ProviderLaunch2FooterIconKey;
  footerText: string;
  markupKey: ProviderLaunchBubbleMarkupKey;
  revealDelayMs: number;
}

export interface ProviderLaunch2ShowcaseCardProps {
  cardIndex: number;
  pillTitle: string;
  pillIcon: ProviderLaunch2PillIconKey;
  footerIcon: ProviderLaunch2FooterIconKey;
  footerText: string;
  offsetMiddle: boolean;
}
