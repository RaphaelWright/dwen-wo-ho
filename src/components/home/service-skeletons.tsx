"use client";

import { m } from "motion/react";
import Image from "next/image";
import {
  IconHeartHandshake,
  IconShieldLock,
  IconLock,
} from "@tabler/icons-react";

const SLIDE_RIGHT_VARIANTS = {
  initial: { x: 0 },
  animate: { x: 10, rotate: 5, transition: { duration: 0.2 } },
};

const SLIDE_LEFT_VARIANTS = {
  initial: { x: 0 },
  animate: { x: -10, rotate: -5, transition: { duration: 0.2 } },
};

const GRADIENT_SHIFT_VARIANTS = {
  initial: { backgroundPosition: "0 50%" },
  animate: { backgroundPosition: ["0, 50%", "100% 50%", "0 50%"] },
};

const CARD_FAN_FIRST = {
  initial: { x: 20, rotate: -5 },
  hover: { x: 0, rotate: 0 },
};

const CARD_FAN_SECOND = {
  initial: { x: -20, rotate: 5 },
  hover: { x: 0, rotate: 0 },
};

export const SkeletonOne = () => {
  return (
    <m.div
      initial="initial"
      whileHover="animate"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-24 w-full flex-1 flex-col space-y-2 rounded-lg bg-linear-to-b from-violet-300 via-purple-200 to-pink-100"
    >
      <m.div
        variants={SLIDE_RIGHT_VARIANTS}
        className="flex flex-row items-start space-x-2 rounded-2xl p-2"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-100">
          <Image
            src="/avatars/man-with-glasses.png"
            alt="Support"
            width={100}
            height={100}
            className="size-5 object-cover"
          />
        </div>
        <div className="rounded-lg bg-gray-100 p-2 text-xs text-gray-700 dark:bg-neutral-900 dark:text-gray-300">
          Hello, I&apos;m here. How can I help you today?
        </div>
      </m.div>
      <m.div
        variants={SLIDE_LEFT_VARIANTS}
        className="ml-auto flex w-3/4 flex-row items-center justify-end space-x-2 rounded-full p-2"
      >
        <div className="rounded-lg bg-purple-100 p-2 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
          I&apos;m feeling really anxious...
        </div>
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
          <div className="flex h-full w-full items-center justify-center bg-gray-300 text-[10px] text-gray-500">
            <Image
              src="/avatars/young-lady.png"
              alt="Support"
              width={100}
              height={100}
              className="mt-0.5 size-5 object-cover"
            />
          </div>
        </div>
      </m.div>
    </m.div>
  );
};

export const SkeletonTwo = () => {
  return (
    <m.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-24 w-full flex-1 flex-col space-y-2 rounded-lg bg-linear-to-b from-violet-200 via-purple-300 to-pink-200"
    >
      <m.div className="flex w-3/4 flex-row items-center space-x-2 rounded-2xl p-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
          <IconLock className="h-3 w-3 text-green-600" />
        </div>
        <p className="rounded-xl bg-purple-100 p-2 text-xs text-purple-900">
          Is this anonymous?
        </p>
      </m.div>

      <m.div
        variants={SLIDE_LEFT_VARIANTS}
        className="ml-auto flex flex-row items-center space-x-2 rounded-2xl p-2"
      >
        <p className="rounded-xl bg-green-50 p-2 text-xs text-green-900">
          Yes. E2E Encrypted 🔒
        </p>
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100">
          <IconShieldLock className="h-3 w-3 text-purple-600" />
        </div>
      </m.div>
    </m.div>
  );
};

export const SkeletonThree = () => {
  return (
    <m.div
      initial="initial"
      animate="animate"
      variants={GRADIENT_SHIFT_VARIANTS}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex h-full min-h-24 w-full flex-1 flex-col space-y-2 overflow-hidden rounded-lg"
    >
      <div className="h-full w-full overflow-hidden">
        <Image
          src="/Students/15.jpeg"
          alt="Support"
          width={1080}
          height={800}
          quality={100}
          className="h-full w-full object-cover"
        />
      </div>
    </m.div>
  );
};

export const SkeletonFour = () => {
  return (
    <m.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-24 w-full flex-1 flex-row space-x-2"
    >
      <m.div
        variants={CARD_FAN_FIRST}
        className="relative flex h-full w-1/3 flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/providers/counsellor.jpg"
            alt="Therapy Session"
            width={1080}
            height={800}
            quality={100}
            className="h-full w-full object-cover"
          />
          <div className="/70/70 absolute inset-0" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-purple-100 shadow-sm">
            <Image
              src="/providers/counsellor.jpg"
              alt="Dr. Ama"
              width={1080}
              height={800}
              quality={100}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-2 text-center text-xs font-semibold text-white sm:text-sm">
            Counsellor
          </p>
          <p className="mt-2 rounded-full border border-purple-500 bg-purple-100 px-2 py-0.5 text-[10px] text-purple-600 dark:bg-purple-900/20">
            Dr. Ama
          </p>
        </div>
      </m.div>
      <m.div className="relative z-20 flex h-full w-1/3 flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 shadow-lg backdrop-blur-xs dark:border-white/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-br from-green-50 to-purple-50 opacity-50 dark:from-green-900/20 dark:to-purple-900/20" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-green-100 shadow-sm">
            <IconHeartHandshake className="h-7 w-7 text-green-600" />
          </div>
          <p className="mt-2 text-center text-xs font-bold text-gray-800 sm:text-sm dark:text-gray-100">
            Match!
          </p>
          <p className="mt-2 rounded-full border border-green-500 bg-green-100 px-2 py-0.5 text-[10px] text-green-700 dark:bg-green-900/20">
            98% Compatible
          </p>
        </div>
      </m.div>
      <m.div
        variants={CARD_FAN_SECOND}
        className="relative flex h-full w-1/3 flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/Students/2.jpg"
            alt="Student"
            width={1080}
            height={800}
            quality={100}
            className="h-full w-full object-cover"
          />
          <div className="/70/70 absolute inset-0" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-2 flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-blue-100 shadow-sm">
            <Image
              src="/Students/2.jpg"
              alt="Mr.kofi"
              width={1080}
              height={800}
              quality={100}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-2 text-center text-xs font-semibold text-white sm:text-sm">
            Student
          </p>
          <p className="mt-2 rounded-full border border-blue-500 bg-blue-100 px-2 py-0.5 text-[10px] text-blue-600 dark:bg-blue-900/20">
            Mr. Kojo
          </p>
        </div>
      </m.div>
    </m.div>
  );
};

export const SkeletonFive = () => {
  return (
    <m.div
      initial="initial"
      whileHover="animate"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-24 w-full flex-1 flex-col space-y-2 rounded-lg bg-linear-to-b from-violet-300 via-purple-200 to-pink-100"
    >
      <m.div
        variants={SLIDE_RIGHT_VARIANTS}
        className="flex flex-row items-start space-x-2 rounded-2xl p-2"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-purple-50">
          <Image
            src="/avatars/excited-lady.png"
            alt="User Avatart"
            width={100}
            height={100}
            className="h-full w-full object-cover"
          />
        </div>
        <p className="rounded-xl bg-green-100 p-2 text-xs text-green-900">
          Feeling much better after my session today...
        </p>
      </m.div>
      <m.div
        variants={SLIDE_LEFT_VARIANTS}
        className="ml-auto flex w-3/4 flex-row items-center justify-end space-x-2 rounded-full p-2"
      >
        <p className="rounded-xl bg-purple-50 p-2 text-xs text-purple-900">
          Glad to hear that!
        </p>
        <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-green-100">
          <Image
            src="/avatars/counsellor.png"
            alt="Counselor Avatar"
            width={100}
            height={100}
            className="h-full w-full object-cover"
          />
        </div>
      </m.div>
    </m.div>
  );
};
