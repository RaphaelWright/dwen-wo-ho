import { PARTNER_SCHOOLS } from "@/_unused/lib/marketing/landing";

export interface MarqueeRowProps {
  items: typeof PARTNER_SCHOOLS;
  direction?: "left" | "right";
  speed?: number;
}
