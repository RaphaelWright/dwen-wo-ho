"use client";

import { PARTNER_SCHOOLS } from "@/lib/constants/mock-data";
import WidthConstraint from "../ui/width-constraint";
import { motion } from "framer-motion";
import Image from "next/image";

const SocialProof = () => {
  return (
    <WidthConstraint>
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Trusted by students from top PARTNER_SCHOOLS
        </p>
      </div>

      <div className="relative flex flex-col gap-8 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-background to-transparent z-10" />

        {/* First Row - Moves Left */}
        <motion.div
          className="flex gap-16 items-center"
          animate={{ x: [0, -1340] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {[
            ...PARTNER_SCHOOLS.slice(0, 10),
            ...PARTNER_SCHOOLS.slice(0, 10),
          ].map((uni, idx) => (
            <div key={`row1-${idx}`} className="cursor-pointer shrink-0">
              <Image
                src={uni.logo}
                alt={uni.name}
                width={55}
                height={55}
                quality={100}
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>

        {/* Second Row - Moves Right */}
        <motion.div
          className="flex gap-16 items-center"
          animate={{ x: [-1340, 0] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {[...PARTNER_SCHOOLS.slice(4), ...PARTNER_SCHOOLS.slice(4)].map(
            (uni, idx) => (
              <div key={`row2-${idx}`} className="cursor-pointer shrink-0">
                <Image
                  src={uni.logo}
                  alt={uni.name}
                  width={55}
                  height={55}
                  quality={100}
                  className="object-contain"
                />
              </div>
            ),
          )}
        </motion.div>
      </div>
    </WidthConstraint>
  );
};

export default SocialProof;
