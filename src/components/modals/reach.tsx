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
            className="fixed inset-0 backdrop-blur-3xl bg-background/80 z-50"
            onClick={onClose}
          />
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden flex flex-col max-h-[90vh] border border-border">
              {/* Header */}
              <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Reach Overview
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Impact and engagement metrics
                    </p>
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto">
                {/* Top Section: Total Reach & Baseline */}
                <div className="flex flex-col md:flex-row gap-8 mb-10">
                  <div className="flex-1 bg-secondary-accent rounded-2xl p-6 text-primary-foreground shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-primary-foreground/80 font-medium mb-1">
                        Total Student Reach
                      </p>
                      <h3 className="text-5xl font-bold mb-2">293,894</h3>
                      <p className="text-primary-foreground/60 text-sm">
                        Across all partner institutions
                      </p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                      <Users className="w-48 h-48" />
                    </div>
                  </div>

                  <div className="flex-1 bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <label
                      htmlFor="baseline-target"
                      className="block text-sm font-semibold text-foreground mb-2"
                    >
                      Set Baseline Target
                    </label>
                    <div className="flex gap-3">
                      <input
                        id="baseline-target"
                        aria-label="Baseline target"
                        value={baseline}
                        onChange={(e) => setBaseline(e.target.value)}
                        className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium"
                        placeholder="e.g. 300,000"
                      />
                      <button
                        type="button"
                        className="px-6 py-3 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/80 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      This baseline will be used to calculate progress
                      percentages across all schools.
                    </p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {REACH_METRICS.map((metric) => (
                    <div
                      key={metric.label}
                      className="bg-muted rounded-xl p-5 border border-border"
                    >
                      <div
                        className={`w-10 h-10 ${metric.bg} ${metric.color} rounded-lg flex items-center justify-center mb-3`}
                      >
                        <metric.icon className="w-5 h-5" />
                      </div>
                      <p className="text-muted-foreground text-sm font-medium">
                        {metric.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Schools List */}
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <School className="w-5 h-5 text-muted-foreground" />
                    Participating Schools
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {REACH_SCHOOLS.map((school) => (
                      <div
                        key={school}
                        className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-border hover:shadow-sm transition-all"
                      >
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-bold text-sm">
                          {school.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">
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
