import type { Variants } from "motion/react";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
} from "@tabler/icons-react";
import { ROUTES } from "@/lib/constants/infra/routes";
import { ServicesConstants } from "@/lib/types/components/marketing/services";

export const HERO_CONTENT = {
  HOME: {
    BADGE_WORDS: [
      "Live Your Best Life",
      "Student Mental Health",
      "Say No To Suicide",
      "Feel Happier",
      "Boost Your CWA/GPA",
    ],
    TITLE: "Dwen Wo Ho",
    DESCRIPTION: `A safe, confidential space for
            students in Ghana to find mental support and professional care.
            It's never been this easy to take care of your own mental
            health.`,
    FEATURES: [
      "100% Confidential",
      "Licensed Professionals",
      "Student-Friendly Content",
    ],
    DRAGGABLE_CARDS: [
      {
        image: "/home/home-hero-3.jpg",
        alt: "Student smiling",
        className: "relative left-20 top-25",
      },
    ],
    BUTTONS: {
      GET_STARTED: "Get Started",
      LOCK_IN: "Lock In",
    },
  },
  PATIENTS: {
    TEXTS: [
      "Boost Your CWA/GPA 📈",
      "Lower Stress & Anxiety 😌",
      "Feel Happier 😊",
      "Ease Depression 🌧",
      "Build Better Relationships 💞",
      "Improve Your Roomie Vibes 🏡",
    ],
    COLORS: ["#2bb572", "#965ba4", "#eb2129", "#253f91", "#2BA36A", "#965ba4"],
    TITLE: "Dwen Wo Ho",
    SUBTITLE:
      "It's never been this easy to take care of your own mental health, and",
    SUBTITLE_SUFFIX: "living your best life in college.",
    IMAGES: {
      LADY_PAINTING: "/hero/lady-painting.jpeg",
      WOMAN_PAINTING: "/hero/woman-painting.jpeg",
    },
    BUTTONS: {
      GET_STARTED: "Get Started",
      LOCK_IN: "Lock In",
    },
  },
  PROVIDERS: {
    TEXTS: [
      "Psychologists",
      "Counsellors",
      "Therapists",
      "Psychiatrists",
      "Academic Coaches",
      "Providers",
    ],
    COLORS: ["#2bb572", "#965ba4", "#eb2129", "#253f91", "#2BA36A", "#965ba4"],
    TITLE: {
      PREFIX: "Calling all",
      SUFFIX:
        "to bring personalized mental healthcare closer to college students.",
    },
    IMAGE: {
      SRC: "/hero/people-painting.jpeg",
      ALT: "Art studio with people painting",
    },
    BUTTON_TEXT: "Get Started",
  },
};

export const HERO_CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const HERO_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

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

export const SERVICES_DATA: ServicesConstants = {
  HERO: {
    TITLE: "Comprehensive Care for",
    TITLE_HIGHLIGHT: "Every Step of the Way",
    SUBTITLE:
      "Whether you need professional counseling, a listening ear, or just a safe space to vent, we're here for you.",
  },
  ITEMS: {
    CRISIS_SUPPORT: {
      title: "Instant Crisis Support",
      description: "Connect with emergency contacts and resources 24/7.",
      className: "md:col-span-1",
    },
    SAFE_CONFIDENTIAL: {
      title: "Safe & Confidential",
      description: "Your privacy is paramount. Encrypted and anonymous.",
      className: "md:col-span-1",
    },
    PEER_COMMUNITIES: {
      title: "Peer Communities",
      description: "Join student groups who truly understand you.",
      className: "md:col-span-1",
    },
    EXPERT_THERAPY: {
      title: "Expert 1-on-1 Therapy",
      description:
        "Get matched with licensed psychologists tailored to your needs.",
      className: "md:col-span-2",
    },
    MOOD_CHECKINS: {
      title: "Daily Mood Check-ins",
      description: "Track your progress and feelings with simple tools.",
      className: "md:col-span-1",
    },
  },
};

export const PARTNER_SCHOOLS = [
  { name: "University of Ghana", logo: "/schools/legon.png" },
  { name: "KNUST", logo: "/schools/knust.png" },
  { name: "UCC", logo: "/schools/ucc.webp" },
  { name: "UPSA", logo: "/schools/upsa.png" },
  { name: "ATU", logo: "/schools/atu.png" },
  { name: "UENR", logo: "/schools/uenr.png" },
  { name: "UDS", logo: "/schools/uds.png" },
  { name: "Achimota School", logo: "/schools/achimota.png" },
  { name: "PRESEC Legon", logo: "/schools/presec.png" },
  { name: "Mfantsipim School", logo: "/schools/mfantsipim.png" },
  { name: "Wesley Girls High School", logo: "/schools/wesley-girls.png" },
  { name: "Holy Child School", logo: "/schools/holy-child.png" },
  { name: "Adisadel College", logo: "/schools/adisadel.png" },
  { name: "St. James Seminary", logo: "/schools/st-james.png" },
];

export const testimonials = [
  {
    quote:
      "Dwen Wo Ho has been a lifeline during my final year. The ability to connect with counselors anonymously made all the difference.",
    name: "Akosua Mensah",
    designation: "Final Year Student, UG",
    src: "/home/home-hero-2.jpg",
  },
  {
    quote:
      "I finally found a platform that understands the pressure students face. The community support is incredible.",
    name: "Kwame Osei",
    designation: "Engineering Student, KNUST",
    src: "/home/home-hero-1.jpg",
  },
  {
    quote:
      "As a counselor, this tool allows me to reach students who wouldn't normally walk into my office. It's revolutionizing campus mental health.",
    name: "Dr. Abena Darko",
    designation: "Clinical Psychologist",
    src: "/providers/clinical-psychologist.jpg",
  },
  {
    quote:
      "The self-assessment tools helped me understand my anxiety triggers. I feel more in control of my mental health now.",
    name: "Emmanuel Tetteh",
    designation: "Business Student, UPSA",
    src: "/home/home-hero-3.jpg",
  },
  {
    quote:
      "A safe space where I can express myself without fear of judgment. Every student needs this app on their phone.",
    name: "Sarah Afriyie",
    designation: "Medical Student, UCC",
    src: "/home/home-hero-4.jpg",
  },
];

export const STICKY_SCROLL_CONTENT = [
  {
    title: "Feeling Overwhelmed?",
    description:
      "Academic pressure, social expectations, and personal challenges can feel like a heavy weight. It's okay to not be okay. Acknowledging that you're struggling is the first step towards feeling better.",
    image: "/Students/1-mobile.jpg",
    alt: "Student feeling overwhelmed",
  },
  {
    title: "A Safe Space to Unload",
    description:
      "Imagine a place where you can share your deepest worries without judgment. Whether anonymously or with a professional, our platform provides the secure environment you need to let go of your burdens.",
    image: "/Students/6-mobile.jpg",
    alt: "Student in a safe space",
  },
  {
    title: "Connect with Understanding",
    description:
      "You don't have to face it alone. Connect with peers who understand your journey or licensed professionals who can guide you. Real support is just a click away.",
    image: "/Students/4-mobile.jpg",
    alt: "Connecting with others",
  },
  {
    title: "Reclaim Your Peace",
    description:
      "With the right support, you can navigate life's challenges with confidence. Build resilience, find your balance, and get back to living your best life. Your mental health matters.",
    image: "/Students/10-mobile.jpg",
    alt: "Student feeling happy",
  },
];
