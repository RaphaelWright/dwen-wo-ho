import { ROUTES } from "@/lib/constants/infra/routes";
import type { ProviderLaunchShowcaseCard } from "@/lib/types/components/marketing/provider-launch-2";

export const PROVIDER_LAUNCH_2_ROLES = [
  "Counselors",
  "Clinical Psychologists",
  "Therapists",
  "Psychiatrists",
  "Medical Doctors",
  "Registered Nurses",
  "Academic Advisors",
  "Peer Counselors",
  "Tutors",
] as const;

export const PROVIDER_LAUNCH_2_CONTENT = {
  metadata: {
    title: "For Providers",
    description:
      "A narrative launch page for mental health providers exploring how JustGo Health supports care for Gen Z students.",
  },
  navigation: {
    homeLabel: "JustGo Health",
    currentLabel: "Providers",
    primaryCta: "Get Started",
  },
  hero: {
    prefix: "Hello,",
    ctaLabel: "LOCK IN",
  },
  closing: {
    lines: [
      "These are not three separate products. This is one software.",
      "Built to help providers care for Gen Z students with more continuity, context, and confidence.",
    ],
  },
  assets: {
    wave: "/Waving%20hand.gif",
  },
  links: {
    home: ROUTES.public.landing,
    providers: ROUTES.public.joinAsProvider2,
    primaryCta: ROUTES.provider.auth,
  },
  timing: {
    roleRotationMs: 2800,
    initialRevealDelayMs: 300,
    showWaveDelayMs: 900,
    lineTypeIntervalMs: 26,
    lineHoldMs: 1800,
    lineExitMs: 550,
    cardsRevealDelayMs: 500,
    cardStaggerMs: 650,
    closingDelayMs: 600,
    ctaDelayMs: 350,
  },
} as const;

/** Markup strings for the faithful HTML-port launch sequence (`**bold**`, `{{emphasis}}`). */
export const PROVIDER_LAUNCH_2_MARKUP_NARRATIVE = {
  line1:
    "This is a day we have been working towards for {{the last six and a half years.}}",
  line2:
    "Today, JustGo Health is introducing {{three revolutionary products}} to care for Gen Zs.",
} as const;

export const PROVIDER_LAUNCH_2_BUBBLE_MARKUP = {
  bubble1:
    "An intelligent tool that screens your students for **depression, anxiety, stress and suicidality** and connects them right from their phones to you (caregiver) and resources specifically handpicked by experts for Gen Zs.\n\nBecause at 4:30am when they're lonely and **they may be suicidal**, your office is closed, but this isn't.",
  bubble2:
    "A study tool built on Active **Recall, Feynman's Method and Spaced Repetition.**\n\nWe built this tool with Ghanaians who actually won NSMQ, scored **GPA 4.0 and hit SAT 1590** for the students who want to do the same.",
  bubble3:
    "The world's first Human Companion for Gen Z, and every little thing matters to it.\n\n**A bad night's sleep, a quarrel with your bestie, a failed quiz**, it tracks everything, connects everything, because it treats Gen Zs as humans first, students second.",
} as const;

export const PROVIDER_LAUNCH_2_SHOWCASE_CARDS: ProviderLaunchShowcaseCard[] = [
  {
    pillTitle: "Advanced Mental Health",
    pillIcon: "heart",
    footerIcon: "lock",
    footerText: "Private • Evidence-based • Always here",
    markupKey: "bubble1",
    revealDelayMs: 0,
  },
  {
    pillTitle: "Einstein Study Guide",
    pillIcon: "zap",
    footerIcon: "graduation-cap",
    footerText: "Learn better • Retain more • Stress less",
    markupKey: "bubble2",
    revealDelayMs: 1000,
  },
  {
    pillTitle: "Human Companion",
    pillIcon: "handshake",
    footerIcon: "message-circle",
    footerText: "Talk • Share • Feel supported",
    markupKey: "bubble3",
    revealDelayMs: 2000,
  },
];
