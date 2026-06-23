import {
  GraduationCap,
  Handshake,
  Heart,
  Lock,
  MessageCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type {
  ProviderLaunch2FooterIconKey,
  ProviderLaunch2PillIconKey,
} from "@/_unused/lib/types/marketing/for-providers-2";

export const PROVIDER_LAUNCH_2_PILL_ICONS: Record<
  ProviderLaunch2PillIconKey,
  LucideIcon
> = {
  heart: Heart,
  zap: Zap,
  handshake: Handshake,
};

export const PROVIDER_LAUNCH_2_FOOTER_ICONS: Record<
  ProviderLaunch2FooterIconKey,
  LucideIcon
> = {
  lock: Lock,
  "graduation-cap": GraduationCap,
  "message-circle": MessageCircle,
};
