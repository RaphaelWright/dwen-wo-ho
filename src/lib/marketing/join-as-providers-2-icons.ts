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
  JoinAsProvider2FooterIconKey,
  JoinAsProvider2PillIconKey,
} from "@/lib/types/marketing/join-as-provider-2";

export const JOIN_AS_PROVIDER_2_PILL_ICONS: Record<
  JoinAsProvider2PillIconKey,
  LucideIcon
> = {
  heart: Heart,
  zap: Zap,
  handshake: Handshake,
};

export const JOIN_AS_PROVIDER_2_FOOTER_ICONS: Record<
  JoinAsProvider2FooterIconKey,
  LucideIcon
> = {
  lock: Lock,
  "graduation-cap": GraduationCap,
  "message-circle": MessageCircle,
};
