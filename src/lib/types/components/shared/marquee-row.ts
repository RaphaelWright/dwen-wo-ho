import { PARTNER_SCHOOLS } from "@/lib/constants/components/marketing/landing";

export interface MarqueeRowProps {
  items: typeof PARTNER_SCHOOLS;
  direction?: "left" | "right";
  speed?: number;
}
