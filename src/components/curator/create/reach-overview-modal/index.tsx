"use client";

import { Users, School } from "lucide-react";
import { ReachOverviewModalProps } from "@/lib/types/components/shared/overlays";
import { useReach } from "@/hooks/components/curator/create/use-reach";
import {
  REACH_METRICS,
  REACH_SCHOOLS,
} from "@/lib/constants/components/curator/create/reach-overview";
import { AnimatedModalShell } from "@/components/overlays/shared/animated-modal-shell";
import { ModalPanelHeader } from "@/components/overlays/shared/modal-panel-header";

const ReachOverviewModal = ({ isOpen, onClose }: ReachOverviewModalProps) => {
  const { baseline, setBaseline } = useReach();

  return (
    <AnimatedModalShell
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="max-h-[90vh] max-w-4xl"
    >
      <ModalPanelHeader
        title="Reach Overview"
        subtitle="Impact and engagement metrics"
        onClose={onClose}
      />

      <div className="overflow-y-auto p-8">
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
              This baseline will be used to calculate progress percentages
              across all schools.
            </p>
          </div>
        </div>

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
                <span className="text-foreground font-medium">{school}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedModalShell>
  );
};

export default ReachOverviewModal;
