// ─── Roles cycling in the header ─────────────────────────────────────────────
export const ROLES = [
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

// ─── Body-copy lines (support **bold** and {{green}}) ────────────────────────
export const LINE_1 =
  "This is a day we have been working towards for {{the last six and a half years.}}";
export const LINE_2 =
  "Today, JustGo Health is introducing {{three revolutionary products}} to care for Gen Zs.";

// ─── Product card data ────────────────────────────────────────────────────────
export interface CardData {
  id: string;
  pillStyle: "tan" | "purple" | "green";
  pillLabel: string;
  bubbleText: string;
}

export const CARDS: CardData[] = [
  {
    id: "card1",
    pillStyle: "tan",
    pillLabel: "❤️ Advanced Mental Health",
    bubbleText:
      "An intelligent tool that screens your students for **depression, anxiety, stress and suicidality** and connects them right from their phones to you (caregiver) and resources specifically handpicked by experts for Gen Zs.\n\nBecause at 4:30am when they're lonely and **they may be suicidal**, your office is closed, but this isn't.",
  },
  {
    id: "card2",
    pillStyle: "purple",
    pillLabel: "⚡ Einstein Study Guide",
    bubbleText:
      "A study tool built on Active **Recall, Feynman's Method and Spaced Repetition.**\n\nWe built this tool with Ghanaians who actually won NSMQ, scored **GPA 4.0 and hit SAT 1590** for the students who want to do the same.",
  },
  {
    id: "card3",
    pillStyle: "green",
    pillLabel: "🤝 Human Companion",
    bubbleText:
      "The world's first Human Companion for Gen Z, and every little thing matters to it.\n\n**A bad night's sleep, a quarrel with your bestie, a failed quiz**, it tracks everything, connects everything, because it treats Gen Zs as humans first, students second.",
  },
];

// ─── Timing constants (ms) ────────────────────────────────────────────────────
export const T = {
  navDone: 900,
  headerFadeIn: 2000,
  waveDrop: 600,
  waveHold: 2000,
  roleCycleInterval: 2800,
  roleStartDelay: 700,
  typeSpeed: 32, // ms per character for body-copy typing
  line1Hold: 3000,
  disintegrateDuration: 1800,
  betweenLines: 500,
  line2Hold: 3000,
  cardPillHold: 900, // how long pill breathes before bubble appears
  bubbleFadeDelay: 400, // brief pause after bubble fades in before typing starts
  bubbleTypeDuration: 7000, // entire bubble types in over this duration
  betweenCards: 3000,
  lastCardHold: 1500,
  closeLineStagger: 900, // delay between the two closing lines
  lockinDelay: 900, // after second closing line
} as const;
