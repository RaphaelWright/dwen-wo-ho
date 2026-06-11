"use client";
/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import { AnimatePresence, MotionValue, m, useMotionValue, useSpring, useTransform } from "motion/react";

import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  tooltipClassName,
  itemClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
  tooltipClassName?: string;
  itemClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
        tooltipClassName={tooltipClassName}
        itemClassName={itemClassName}
      />
      <FloatingDockMobile
        items={items}
        className={mobileClassName}
        tooltipClassName={tooltipClassName}
        itemClassName={itemClassName}
      />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  tooltipClassName,
  itemClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  tooltipClassName?: string;
  itemClassName?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <m.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <m.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <div className="relative group flex items-center gap-2">
                  <m.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={cn(
                      "rounded-md border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground shadow-md whitespace-pre",
                      tooltipClassName,
                    )}
                  >
                    {item.title}
                  </m.div>
                  <a
                    href={item.href}
                    key={item.title}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full bg-card text-secondary-foreground",
                      itemClassName,
                    )}
                  >
                    <div className="size-4">{item.icon}</div>
                  </a>
                </div>
              </m.div>
            ))}
          </m.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex size-8 items-center justify-center rounded-full bg-background text-secondary-foreground"
      >
        <IconLayoutNavbarCollapse className="size-5 text-muted-foreground" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  tooltipClassName,
  itemClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  tooltipClassName?: string;
  itemClassName?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <m.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-16 items-center gap-4 rounded-2xl bg-transparent px-4 pb-3 w-full",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer
          mouseX={mouseX}
          key={item.title}
          tooltipClassName={tooltipClassName}
          itemClassName={itemClassName}
          {...item}
        />
      ))}
    </m.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  tooltipClassName,
  itemClassName,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  tooltipClassName?: string;
  itemClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 55, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 55, 40]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 28, 20]);
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 28, 20],
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href}>
      <m.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full bg-card/10 hover:bg-accent hover:text-accent-foreground",
          itemClassName,
        )}
      >
        <AnimatePresence>
          {hovered && (
            <m.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className={cn(
                "absolute -top-8 left-1/2 w-fit rounded-md border border-border bg-popover px-2 py-0.5 text-xs whitespace-pre text-popover-foreground shadow-md",
                tooltipClassName,
              )}
            >
              {title}
            </m.div>
          )}
        </AnimatePresence>
        <m.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </m.div>
      </m.div>
    </a>
  );
}
