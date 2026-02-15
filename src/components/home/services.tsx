"use client";
import { cn } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
  IconHeartHandshake,
  IconShieldLock,
  IconUsers,
  IconPhoneCall,
  IconLock,
  IconMoodSmile,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import WidthConstraint from "../ui/width-constraint";
import Image from "next/image";

const Services = () => {
  return (
    <WidthConstraint>
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold">
          Comprehensive Care for <br />
          <span className="text-[#2bb572]">Every Step of the Way</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Whether you need professional counseling, a listening ear, or just a
          safe space to vent, we're here for you.
        </p>
      </div>

      <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={cn("[&>p:text-lg]", item.className)}
            icon={item.icon}
          />
        ))}
      </BentoGrid>
    </WidthConstraint>
  );
};

export default Services;

// --- Skeletons ---

const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-24 dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl p-2 items-start space-x-2"
      >
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 overflow-hidden">
          <Image
            src="/avatars/man-with-glasses.png"
            alt="Support"
            width={100}
            height={100}
            className="size-5 object-cover"
          />
        </div>
        <div className="bg-gray-100 dark:bg-neutral-900 rounded-lg p-2 text-xs text-gray-700 dark:text-gray-300">
          Hello, I'm here. How can I help you today?
        </div>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full p-2 items-center space-x-2 w-3/4 ml-auto  justify-end"
      >
        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2 text-xs text-purple-700 dark:text-purple-300">
          I'm feeling really anxious...
        </div>
        <div className="h-8 w-8 rounded-full bg-gray-200 shrink-0 overflow-hidden">
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-[10px] text-gray-500">
            <Image
              src="/avatars/young-lady.png"
              alt="Support"
              width={100}
              height={100}
              className="size-5 object-cover mt-0.5"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SkeletonTwo = () => {
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-24 dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div className="flex flex-row rounded-2xl p-2 items-center space-x-2  w-3/4">
        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <IconLock className="w-3 h-3 text-green-600" />
        </div>
        <p className="text-xs text-gray-500 bg-purple-100 p-2 rounded-xl">
          Is this anonymous?
        </p>
      </motion.div>

      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-2xl p-2 items-center space-x-2  ml-auto"
      >
        <p className="text-xs text-gray-500 p-2 rounded-xl bg-green-50">
          Yes. E2E Encrypted 🔒
        </p>
        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
          <IconShieldLock className="w-3 h-3 text-purple-600" />
        </div>
      </motion.div>
    </motion.div>
  );
};

const SkeletonThree = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-24 dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2 relative overflow-hidden"
    >
      <div className="overflow-hidden w-full h-full">
        <Image
          src="/Students/15.jpeg"
          alt="Support"
          width={1080}
          height={800}
          quality={100}
          className="object-cover w-full h-full"
        />
      </div>
    </motion.div>
  );
};

const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-24 dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl  dark:border-white/10 border border-neutral-200 flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/providers/counsellor.jpg"
            alt="Therapy Session"
            width={1080}
            height={800}
            quality={100}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 /70/70" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="rounded-full h-10 w-10 bg-purple-100 flex items-center justify-center mb-2 overflow-hidden border-2 border-white shadow-sm">
            <Image
              src="/counsellor.jpg"
              alt="Dr. Ama"
              width={1080}
              height={800}
              quality={100}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="sm:text-sm text-xs text-center font-semibold text-white mt-2">
            Counsellor
          </p>
          <p className="border border-purple-500 bg-purple-100 dark:bg-purple-900/20 text-purple-600 text-[10px] rounded-full px-2 py-0.5 mt-2">
            Dr. Ama
          </p>
        </div>
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl  dark:border-white/10 border border-neutral-200 flex flex-col items-center justify-center shadow-lg overflow-hidden backdrop-blur-xs">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-br from-green-50 to-purple-50 dark:from-green-900/20 dark:to-purple-900/20 opacity-50" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="rounded-full h-12 w-12 bg-green-100 flex items-center justify-center mb-2 border-2 border-white shadow-sm">
            <IconHeartHandshake className="text-green-600 w-7 h-7" />
          </div>
          <p className="sm:text-sm text-xs text-center font-bold text-gray-800 dark:text-gray-100 mt-2">
            Match!
          </p>
          <p className="border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-700 text-[10px] rounded-full px-2 py-0.5 mt-2">
            98% Compatible
          </p>
        </div>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl  dark:border-white/10 border border-neutral-200 flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/Students/2.jpg"
            alt="Student"
            width={1080}
            height={800}
            quality={100}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 /70/70" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="rounded-full size-10 bg-blue-100 flex items-center justify-center mb-2 overflow-hidden border-2 border-white shadow-sm">
            <Image
              src="/Students/2.jpg"
              alt="Mr.kofi"
              width={1080}
              height={800}
              quality={100}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="sm:text-sm text-xs text-center font-semibold text-white mt-2">
            Student
          </p>
          <p className="border border-blue-500 bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-[10px] rounded-full px-2 py-0.5 mt-2">
            Mr. Kojo
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
const SkeletonFive = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-24 dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl p-2 items-start space-x-2 "
      >
        <div className="rounded-full h-8 w-8 bg-purple-50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
          <Image
            src="/avatars/excited-lady.png"
            alt="User Avatar"
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-xs text-neutral-500 bg-green-100 p-2 rounded-xl">
          Feeling much better after my session today...
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full p-2 items-center justify-end space-x-2 w-3/4 ml-auto "
      >
        <p className="text-xs bg-purple-50 text-neutral-500 rounded-xl p-2">
          Glad to hear that!
        </p>
        <div className="rounded-full h-6 w-6 bg-green-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
          <Image
            src="/avatars/counsellor.png"
            alt="Counselor Avatar"
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "Instant Crisis Support",
    description: (
      <span className="text-sm">
        Connect with emergency contacts and resources 24/7.
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: <IconPhoneCall className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Safe & Confidential",
    description: (
      <span className="text-sm">
        Your privacy is paramount. Encrypted and anonymous.
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: <IconLock className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Peer Communities",
    description: (
      <span className="text-sm">
        Join student groups who truly understand you.
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <IconUsers className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Expert 1-on-1 Therapy",
    description: (
      <span className="text-sm">
        Get matched with licensed psychologists tailored to your needs.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <IconHeartHandshake className="h-4 w-4 text-neutral-500" />,
  },

  {
    title: "Daily Mood Check-ins",
    description: (
      <span className="text-sm">
        Track your progress and feelings with simple tools.
      </span>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <IconMoodSmile className="h-4 w-4 text-neutral-500" />,
  },
];
