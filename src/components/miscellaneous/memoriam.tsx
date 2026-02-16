"use client";

import { motion } from "framer-motion";
import WidthConstraint from "../ui/width-constraint";
import {
  MEMORIAM_CONTAINER_VARIANTS,
  MEMORIAM_LIST,
  MEMORIAM_LIST_ITEM_VARIANTS,
  MEMORIAM_QUOTE_VARIANTS,
  MEMORIAM_TITLE_VARIANTS,
} from "@/lib/constants/components/memoriam";

export default function memoriam({
  className,
  showQuote = true,
}: {
  className?: string;
  showQuote?: boolean;
}) {
  return (
    <section className="py-20 bg-gray-50">
      <WidthConstraint className="max-w-250">
        <motion.div
          variants={MEMORIAM_CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px", amount: 0.3 }}
          className={`${className} space-y-10`}
        >
          <motion.div
            variants={MEMORIAM_TITLE_VARIANTS}
            className="text-center"
          >
            <h2 className="text-[#D94A54] text-3xl font-bold">
              In Memoriam.{" "}
              <span className="text-gray-700">
                Their lives are enough for us to act.
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              variants={MEMORIAM_CONTAINER_VARIANTS}
              className="space-y-6"
            >
              {MEMORIAM_LIST.map((person, index) => (
                <motion.div
                  key={index}
                  variants={MEMORIAM_LIST_ITEM_VARIANTS}
                  className="flex items-center gap-4"
                >
                  <div className="h-full">
                    <div className="w-1 rounded-l-xl h-15 lg:h-10 bg-[#D94A54]" />
                  </div>
                  <div className="text-gray-800 flex flex-col lg:flex-row gap-2 text-lg">
                    <p className="font-semibold">{person.name},</p>
                    <p className="text-gray-600">
                      {person.university}, {person.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {showQuote && (
              <motion.div
                variants={MEMORIAM_QUOTE_VARIANTS}
                className="flex flex-col justify-center"
              >
                <blockquote className="text-[#D94A54] text-2xl lg:text-4xl font-bold text-center leading-relaxed mb-6">
                  &ldquo;We all cried the same tears on different cheeks.&rdquo;
                </blockquote>
                <cite className="font-medium text-base text-center">
                  ~ Dave (We&apos;re all alone in this together Album)
                </cite>
              </motion.div>
            )}
          </div>
        </motion.div>
      </WidthConstraint>
    </section>
  );
}
