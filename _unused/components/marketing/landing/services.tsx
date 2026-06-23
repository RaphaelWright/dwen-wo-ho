"use client";

import { cn } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "@/_unused/components/bento-grid";
import {
  IconHeartHandshake,
  IconUsers,
  IconPhoneCall,
  IconLock,
  IconMoodSmile,
} from "@tabler/icons-react";
import WidthConstraint from "@/components/ui/width-constraint";
import { SERVICES_DATA } from "@/_unused/lib/marketing/landing";
import {
  SkeletonOne,
  SkeletonTwo,
  SkeletonThree,
  SkeletonFour,
  SkeletonFive,
} from "./service-skeletons";

const Services = () => {
  const { HERO, ITEMS } = SERVICES_DATA;

  const items = [
    {
      ...ITEMS.CRISIS_SUPPORT,
      header: <SkeletonOne />,
      icon: <IconPhoneCall className="h-4 w-4 text-neutral-500" />,
    },
    {
      ...ITEMS.SAFE_CONFIDENTIAL,
      header: <SkeletonTwo />,
      icon: <IconLock className="h-4 w-4 text-neutral-500" />,
    },
    {
      ...ITEMS.PEER_COMMUNITIES,
      header: <SkeletonThree />,
      icon: <IconUsers className="h-4 w-4 text-neutral-500" />,
    },
    {
      ...ITEMS.EXPERT_THERAPY,
      header: <SkeletonFour />,
      icon: <IconHeartHandshake className="h-4 w-4 text-neutral-500" />,
    },
    {
      ...ITEMS.MOOD_CHECKINS,
      header: <SkeletonFive />,
      icon: <IconMoodSmile className="h-4 w-4 text-neutral-500" />,
    },
  ];

  return (
    <WidthConstraint>
      <div className="mx-auto mb-16 max-w-2xl space-y-4 text-center">
        <h2 className="text-3xl font-bold lg:text-4xl">
          {HERO.TITLE} <br />
          <span className="text-[#2bb572]">{HERO.TITLE_HIGHLIGHT}</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {HERO.SUBTITLE}
        </p>
      </div>

      <BentoGrid className="mx-auto max-w-4xl md:auto-rows-[20rem]">
        {items.map((item) => (
          <BentoGridItem
            key={item.title}
            title={item.title}
            description={<span className="text-sm">{item.description}</span>}
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
