"use client";

import { AnimatePresence, m } from "motion/react";
import { X, Users, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReachModalProps } from "@/lib/types/modals";
import { useReach } from "@/hooks/components/modals/use-reach";
import {
  REACH_METRICS,
  REACH_SCHOOLS,
} from "@/lib/constants/components/modals/reach";

const ReachModal = ({ isOpen, onClose }: ReachModalProps) => {
  const { baseline, setBaseline } = useReach();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background/80 fixed inset-0 z-50 backdrop-blur-3xl"
            onClick={onClose}
          />
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card text-foreground border-border mx-auto flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border shadow-2xl">
              {/* Header */}
              <div className="border-border bg-muted/30 flex items-center justify-between border-b px-8 py-6">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-foreground text-xl font-bold">
                      Reach Overview
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Impact and engagement metrics
                    </p>
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-8">
                {/* Top Section: Total Reach & Baseline */}
                <div className="mb-10 flex flex-col gap-8 md:flex-row">
                  <div className="bg-secondary-accent text-primary-foreground relative flex-1 overflow-hidden rounded-2xl p-6 shadow-lg">
                    <div className="relative z-10">
                      <p className="text-primary-foreground/80 mb-1 font-medium">
                        Total Student Reach
                      </p>
                      <h3 className="mb-2 text-5xl font-bold">293,894</h3>
                      <p className="text-primary-foreground/60 text-sm">
                        Across all partner institutions
                      </p>
                    </div>
                    <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 transform opacity-10">
                      <Users className="h-48 w-48" />
                    </div>
                  </div>

                  <div className="bg-card border-border flex-1 rounded-2xl border p-6 shadow-sm">
                    <label
                      htmlFor="baseline-target"
                      className="text-foreground mb-2 block text-sm font-semibold"
                    >
                      Set Baseline Target
                    </label>
                    <div className="flex gap-3">
                      <input
                        id="baseline-target"
                        aria-label="Baseline target"
                        value={baseline}
                        onChange={(e) => setBaseline(e.target.value)}
                        className="bg-muted border-border focus:ring-primary/20 focus:border-primary flex-1 rounded-xl border px-4 py-3 text-lg font-medium transition-all focus:ring-2 focus:outline-none"
                        placeholder="e.g. 300,000"
                      />
                      <button
                        type="button"
                        className="bg-foreground text-background hover:bg-foreground/80 rounded-xl px-6 py-3 font-semibold transition-colors"
                      >
                        Update
                      </button>
                    </div>
                    <p className="text-muted-foreground mt-3 text-xs">
                      This baseline will be used to calculate progress
                      percentages across all schools.
                    </p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {REACH_METRICS.map((metric) => (
                    <div
                      key={metric.label}
                      className="bg-muted border-border rounded-xl border p-5"
                    >
                      <div
                        className={`h-10 w-10 ${metric.bg} ${metric.color} mb-3 flex items-center justify-center rounded-lg`}
                      >
                        <metric.icon className="h-5 w-5" />
                      </div>
                      <p className="text-muted-foreground text-sm font-medium">
                        {metric.label}
                      </p>
                      <p className="text-foreground text-2xl font-bold">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Schools List */}
                <div>
                  <h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-bold">
                    <School className="text-muted-foreground h-5 w-5" />
                    Participating Schools
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {REACH_SCHOOLS.map((school) => (
                      <div
                        key={school}
                        className="bg-card border-border hover:border-border flex items-center gap-3 rounded-xl border p-4 transition-all hover:shadow-sm"
                      >
                        <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                          {school.charAt(0)}
                        </div>
                        <span className="text-foreground font-medium">
                          {school}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReachModal;
