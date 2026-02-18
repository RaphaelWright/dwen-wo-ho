import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
} from "@tabler/icons-react";
import { ROUTES } from "@/lib/constants/routes";

export const FOOTER_DOCK_ITEMS = [
  {
    title: "Twitter",
    icon: IconBrandX,
    href: "#",
  },
  {
    title: "Facebook",
    icon: IconBrandFacebook,
    href: "#",
  },
  {
    title: "Instagram",
    icon: IconBrandInstagram,
    href: "#",
  },
];

export const NEWSLETTER_PLACEHOLDERS = [
  "Enter your e-mail",
  "Join our community",
  "Stay updated",
];

export const COMMUNITY_GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format&fit=crop&q=60",
    alt: "Yoga Session",
  },
  {
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&auto=format&fit=crop&q=60",
    alt: "Community Gathering",
  },
  {
    src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop&q=60",
    alt: "Healthy Food",
  },
  {
    src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=60",
    alt: "Mindfulness",
  },
];

export const FOOTER_BOTTOM_LINKS = [
  { label: "Home", href: ROUTES.public.landing },
  { label: "About", href: ROUTES.public.about },
  { label: "Privacy Policy", href: ROUTES.public.privacyPolicy },
  {
    label: "Terms & Conditions",
    href: ROUTES.public.termsAndConditions,
  },
  { label: "Cookie Policy", href: ROUTES.public.cookiePolicy },
] as const;

export const WELLNESS_TIPS = [
  {
    url: "https://www.healthline.com/nutrition/7-health-benefits-of-water",
    title: "Hydration is key!",
    description:
      "Drink at least 8 glasses of water a day to keep your energy levels high.",
  },
  {
    url: "https://www.headspace.com/meditation/daily-meditation",
    title: "Take 5 minutes to meditate daily.",
    description: "A calm mind leads to a healthier body.",
  },
  {
    url: "https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/walking/art-20046261",
    title: "Move your body!",
    description: "Even a short walk can improve your mood and circulation.",
  },
];
