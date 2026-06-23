export interface Achievement {
  text: string;
  emoji: string;
}

export interface Character {
  headline: string;
  name: string;
  pillEmoji: string;
  factPrefix: string;
  factHighlight: string;
  factSuffix: string;
  achievements: Achievement[];
  photoSrc: string;
  photoStyle: React.CSSProperties;
}

export const CHARACTERS: Character[] = [
  {
    headline: "ace your SAT?",
    name: "Setornam",
    pillEmoji: "🧑‍💻",
    factPrefix: "He scored ",
    factHighlight: "1590",
    factSuffix: " in SAT(99th Percentile)",
    achievements: [
      { text: "Scored 1590 in SAT", emoji: "😯" },
      { text: "Won Sharks Quiz", emoji: "😮" },
      { text: "Won full scholarship to Uni.", emoji: "😱" },
      { text: "Graduated with CGPA 4.0", emoji: "🤯" },
      { text: "Never had B, all As in every exam", emoji: "🥳" },
    ],
    photoSrc: "/setornam.png",
    photoStyle: {
      left: "-150px",
      top: "140px",
      width: "1260px",
      height: "auto",
      transform: "rotate(-1deg)",
    },
  },
  {
    headline: "wanna win NSMQ?",
    name: "Newton",
    pillEmoji: "🏆",
    factPrefix: "He won both the ",
    factHighlight: "Regional and National NSMQ",
    factSuffix: ".",
    achievements: [
      { text: "Won the Presidential BECE Award", emoji: "😯" },
      { text: "Won the Regional NSMQ (2019)", emoji: "😮" },
      { text: "Won the National NSMQ (2019)", emoji: "😱" },
      { text: "Graduated from KNUST Medical School", emoji: "🤯" },
    ],
    photoSrc: "/UI SEPT 25-19.png",
    photoStyle: {
      left: "40px",
      top: "80px",
      width: "auto",
      height: "990px",
      transform: "scaleX(-1)",
    },
  },
];

// Timing constants — tweak freely
export const T = {
  stageFade: 1000,
  bannerDelay: 1000,
  bannerInDuration: 1000,
  waveDropDelay: 500,
  waveDropDuration: 500,
  shakeDelay: 300,
  shakeDuration: 1000,
  bannerHold: 2000,
  bannerOutDuration: 1000,
  pauseAfterBanner: 1000,
  typeSpeed: 65,
  holdBold: 2000,
  deactivateDuration: 1000,
  pillDelay: 1000,
  meetShakeDelay: 300,
  pillHold: 2000,
  statLineHold: 2000,
  clearTextDuration: 1000,
  relocateDuration: 1000,
  photoDelay: 300,
  photoDuration: 1000,
  achStartDelay: 500,
  achStagger: 2000,
  blankHold: 1000,
  pillTextCycle: 2000,
  allLitHold: 2000,
} as const;
