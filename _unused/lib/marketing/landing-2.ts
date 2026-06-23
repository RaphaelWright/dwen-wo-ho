import { ROUTES } from "@/lib/constants/infra/routes";
import type {
  LockIn2AchievementSlot,
  LockIn2Character,
} from "@/_unused/lib/types/marketing/landing-2";

const LOCK_IN_2_EMOJIS = {
  Hushed: "😮",
  Astonished: "😲",
  Screaming: "😱",
  Exploding: "🤯",
  Partying: "🥳",
};

export const LOCK_IN_2_TIMING = {
  stageFade: 700,
  bannerDelay: 700,
  bannerInDuration: 700,
  waveDropDelay: 350,
  waveDropDuration: 350,
  shakeDelay: 200,
  shakeDuration: 700,
  bannerHold: 1400,
  bannerOutDuration: 700,
  pauseAfterBanner: 700,
  typeSpeed: 45,
  holdBold: 1400,
  deactivateDuration: 700,
  pillDelay: 700,
  meetShakeDelay: 200,
  pillHold: 1400,
  statLineHold: 1400,
  clearTextDuration: 700,
  relocateDuration: 700,
  photoDelay: 200,
  photoDuration: 700,
  achStartDelay: 350,
  achStagger: 1400,
  blankHold: 700,
  allLitHold: 1400,
  lockInLabelMs: 520,
} as const;

export const LOCK_IN_2_ACHIEVEMENT_SLOTS: LockIn2AchievementSlot[] = [
  {
    id: 1,
    top: 320,
    emoji: LOCK_IN_2_EMOJIS.Hushed,
    text: "Scored 1590 in SAT",
  },
  {
    id: 2,
    top: 430,
    emoji: LOCK_IN_2_EMOJIS.Astonished,
    text: "Won Sharks Quiz",
  },
  {
    id: 3,
    top: 540,
    emoji: LOCK_IN_2_EMOJIS.Screaming,
    text: "Won full scholarship to Uni.",
  },
  {
    id: 4,
    top: 650,
    emoji: LOCK_IN_2_EMOJIS.Exploding,
    text: "Graduated with CGPA 4.0",
  },
  {
    id: 5,
    top: 760,
    emoji: LOCK_IN_2_EMOJIS.Partying,
    text: "Never had B, all As in every exam",
  },
];

export const LOCK_IN_2_CHARACTERS: LockIn2Character[] = [
  {
    headline: "ace your SAT?",
    name: "Setornam",
    factPrefix: "He scored ",
    factHighlight: "1590",
    factSuffix: " in SAT(99th Percentile)",
    achievements: [
      { text: "Scored 1590 in SAT", emoji: LOCK_IN_2_EMOJIS.Hushed },
      { text: "Won Sharks Quiz", emoji: LOCK_IN_2_EMOJIS.Astonished },
      {
        text: "Won full scholarship to Uni.",
        emoji: LOCK_IN_2_EMOJIS.Partying,
      },
      { text: "Graduated with CGPA 4.0", emoji: LOCK_IN_2_EMOJIS.Partying },
      {
        text: "Never had B, all As in every exam",
        emoji: LOCK_IN_2_EMOJIS.Partying,
      },
    ],
    photo: "/marketing/lock-in-2/setornam.png",
    photoStyle: {
      left: "60px",
      top: "90px",
      width: "760px",
      height: "auto",
      transform: "rotate(-1deg)",
    },
  },
  {
    headline: "wanna win NSMQ?",
    name: "Newton",
    factPrefix: "He won both the ",
    factHighlight: "Regional and National NSMQ",
    factSuffix: ".",
    achievements: [
      {
        text: "Won the Presidential BECE Award",
        emoji: LOCK_IN_2_EMOJIS.Hushed,
      },
      {
        text: "Won the Regional NSMQ (2019)",
        emoji: LOCK_IN_2_EMOJIS.Astonished,
      },
      {
        text: "Won the National NSMQ (2019)",
        emoji: LOCK_IN_2_EMOJIS.Screaming,
      },
      {
        text: "Graduated from KNUST Medical School",
        emoji: LOCK_IN_2_EMOJIS.Exploding,
      },
    ],
    photo: "/marketing/lock-in-2/newton.png",
    photoStyle: {
      left: "40px",
      top: "120px",
      width: "auto",
      height: "720px",
      transform: "scaleX(-1)",
      filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.5))",
    },
  },
];

export const LOCK_IN_2_CONTENT = {
  metadata: {
    title: "Lock In",
    description:
      "Meet Gen Z achievers and lock in your future with JustGo Health.",
  },
  navigation: {
    pledgeLabel: "The Pledge",
    providersLabel: "Providers",
  },
  intro: {
    bannerText: "Hello, Gen Z",
    lockInDefault: "Lock In Now",
  },
  assets: {
    wave: "/Waving%20hand.gif",
  },
  links: {
    home: ROUTES.public.landing,
    pledge: ROUTES.public.about,
    providers: ROUTES.public.joinAsProvider2,
    lockIn: ROUTES.patient.lockIn,
  },
} as const;
