"use client";

import { Activity, CheckCircle2, Clock, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { PatientActionsPanelProps } from "@/lib/types/components/curator/patient-dashboard";

export default function PatientActionsPanel({
  actions,
  isActionsLoading,
  activeTab,
  onTabChange,
}: PatientActionsPanelProps) {
  return (
    <div className="bg-card border-border flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm">
      <div className="flex min-h-0 flex-1 flex-col p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-bold">Actions History</h2>
          <Button
            type="button"
            variant="link"
            className="text-primary text-sm font-medium hover:underline"
          >
            View All
          </Button>
        </div>

        <div className="bg-muted mb-6 flex shrink-0 gap-1 rounded-xl p-1">
          <Button
            type="button"
            onClick={() => onTabChange("assessment")}
            variant="ghost"
            className={cn(
              "h-8 flex-1 rounded-lg py-1.5 text-xs font-bold transition-all hover:bg-none",
              activeTab === "assessment"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            Pending
          </Button>
          <Button
            type="button"
            onClick={() => onTabChange("history")}
            variant="ghost"
            className={cn(
              "h-8 flex-1 rounded-lg py-1.5 text-xs font-bold transition-all hover:bg-none",
              activeTab === "history"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            History
          </Button>
        </div>

        <div className="scrollbar-thumb-border flex-1 scrollbar-thin space-y-3 overflow-y-auto">
          {isActionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2" />
            </div>
          ) : actions.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-xs">
              No actions yet
            </p>
          ) : (
            actions.map((action, i) => (
              <div
                key={action.id ?? i}
                className="hover:bg-muted/50 hover:border-border group flex gap-4 rounded-xl border border-transparent p-3 transition-colors"
              >
                <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-foreground truncate text-sm font-bold">
                    {action.title}
                  </h4>
                  <p className="text-muted-foreground truncate text-xs">
                    {action.type}
                  </p>
                  <div className="text-muted-foreground mt-1 flex items-center gap-1 text-[10px]">
                    <Clock className="h-3 w-3" />
                    <p className="pt-0.5">
                      {action.createdAt
                        ? new Date(action.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-border bg-muted/10 mt-auto border-t p-4">
        <Button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" /> Add Action
        </Button>
      </div>
    </div>
  );
}
