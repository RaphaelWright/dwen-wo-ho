import { easeOut } from "framer-motion";

export const MEMORIAM_LIST = [
  { name: "Nicholas Kumi Dankwa", university: "UEW", time: "3 months ago" },
  { name: "Joana Deladem Yabani", university: "KNUST", time: "5 months ago" },
  { name: "Rita Anane", university: "UEW", time: "2 years ago" },
  {
    name: "Adwoa A. Anyinadu-Antwi",
    university: "KNUST",
    time: "8 years ago",
  },
  { name: "Jennifer Nyarko", university: "UG", time: "8 years ago" },
];

export const MEMORIAM_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

export const MEMORIAM_LIST_ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

export const MEMORIAM_QUOTE_VARIANTS = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
      delay: 0.5,
    },
  },
};

export const MEMORIAM_TITLE_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};
