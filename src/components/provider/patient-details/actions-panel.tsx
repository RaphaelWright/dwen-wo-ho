"use client";

import { useState } from "react";
import { Activity, Clock, CheckCircle2, Plus, X } from "lucide-react";
import { m, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { cn } from "@/lib/utils";
import { PatientActionResponseDTO } from "@/lib/types/api/patient-results";
import { ActionTab } from "@/hooks/provider/patient-details/use-patient-details";

interface ActionsPanelProps {
  activeTab: ActionTab;
  setActiveTab: (tab: ActionTab) => void;
  pendingActions: PatientActionResponseDTO[];
  historyActions: PatientActionResponseDTO[];
  isLoading: boolean;
  onAddAction: (data: {
    title: string;
    type: string;
    notes?: string;
  }) => Promise<PatientActionResponseDTO>;
  isAddingAction: boolean;
}

export function ActionsPanel({
  activeTab,
  setActiveTab,
  pendingActions,
  historyActions,
  isLoading,
  onAddAction,
  isAddingAction,
}: ActionsPanelProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    notes: "",
  });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    await onAddAction(formData);
    setFormData({ title: "", type: "", notes: "" });
    setIsFormOpen(false);
  };

  const displayActions =
    activeTab === "pending" ? pendingActions : historyActions;

  return (
    <div className="bg-card border-border flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm">
      <div className="flex min-h-0 flex-1 flex-col p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-bold">Actions History</h2>
          <span className="text-muted-foreground text-xs">
            {pendingActions.length} pending • {historyActions.length} completed
          </span>
        </div>

        {/* Tabs */}
        <div className="bg-muted mb-6 flex shrink-0 gap-1 rounded-xl p-1">
          <Button
            onClick={() => setActiveTab("pending")}
            variant="ghost"
            className={cn(
              "h-8 flex-1 rounded-lg py-1.5 text-xs font-bold transition-all hover:bg-none",
              activeTab === "pending"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            Pending ({pendingActions.length})
          </Button>
          <Button
            onClick={() => setActiveTab("history")}
            variant="ghost"
            className={cn(
              "h-8 flex-1 rounded-lg py-1.5 text-xs font-bold transition-all hover:bg-none",
              activeTab === "history"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            History ({historyActions.length})
          </Button>
        </div>

        {/* Add Action Form */}
        <AnimatePresence>
          {isFormOpen && (
            <m.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="bg-muted/50 border-border mb-4 space-y-3 overflow-hidden rounded-xl border p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground text-sm font-medium">
                  New Action
                </span>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="hover:bg-muted rounded-full p-1"
                >
                  <X className="text-muted-foreground h-4 w-4" />
                </button>
              </div>
              <input
                type="text"
                aria-label="Action title"
                placeholder="Action title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="bg-background border-border focus:ring-primary/20 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-hidden"
              />
              <input
                type="text"
                aria-label="Action type"
                placeholder="Type (e.g., Assessment, Treatment)..."
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="bg-background border-border focus:ring-primary/20 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-hidden"
              />
              <textarea
                aria-label="Action notes"
                placeholder="Notes (optional)..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="bg-background border-border focus:ring-primary/20 w-full resize-none rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-hidden"
                rows={2}
              />
              <div className="flex gap-2">
                <LoadingButton
                  type="submit"
                  loading={isAddingAction}
                  loadingText="Saving..."
                  disabled={!formData.title.trim()}
                  className="h-8 flex-1 text-xs"
                >
                  Save Action
                </LoadingButton>
              </div>
            </m.form>
          )}
        </AnimatePresence>

        {/* Actions List */}
        <div className="scrollbar-thumb-border flex-1 scrollbar-thin space-y-3 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2" />
            </div>
          ) : displayActions.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-xs">
              No {activeTab} actions
            </p>
          ) : (
            displayActions.map((action, i) => (
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
                  {action.notes && (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                      {action.notes}
                    </p>
                  )}
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
                  <CheckCircle2
                    className={cn(
                      "h-4 w-4",
                      activeTab === "history"
                        ? "text-green-500"
                        : "text-muted-foreground/30",
                    )}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Action Button */}
      <div className="border-border bg-muted/10 mt-auto border-t p-4">
        <Button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={cn(
            "flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold shadow-sm transition-colors",
            isFormOpen
              ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              : "bg-emerald-600 text-white hover:bg-emerald-700",
          )}
        >
          {isFormOpen ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Action
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
