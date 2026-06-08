"use client";

import { useState } from "react";
import { Activity, Clock, CheckCircle2, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { cn } from "@/lib/utils";
import { PatientActionResponseDTO } from "@/lib/types/api/patient-results";
import { ActionTab } from "@/hooks/provider/use-provider-patient-details";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    await onAddAction(formData);
    setFormData({ title: "", type: "", notes: "" });
    setIsFormOpen(false);
  };

  const displayActions =
    activeTab === "pending" ? pendingActions : historyActions;

  return (
    <div className="bg-card rounded-3xl shadow-sm border border-border h-full flex flex-col overflow-hidden">
      <div className="p-6 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Actions History</h2>
          <span className="text-xs text-muted-foreground">
            {pendingActions.length} pending • {historyActions.length} completed
          </span>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-muted rounded-xl mb-6 shrink-0 gap-1">
          <Button
            onClick={() => setActiveTab("pending")}
            variant="ghost"
            className={cn(
              "flex-1 py-1.5 h-8 text-xs font-bold rounded-lg transition-all hover:bg-none",
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
              "flex-1 py-1.5 h-8 text-xs font-bold rounded-lg transition-all hover:bg-none",
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
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mb-4 p-4 bg-muted/50 rounded-xl border border-border space-y-3 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  New Action
                </span>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 hover:bg-muted rounded-full"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Action title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="text"
                placeholder="Type (e.g., Assessment, Treatment)..."
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
              <textarea
                placeholder="Notes (optional)..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <LoadingButton
                  type="submit"
                  loading={isAddingAction}
                  loadingText="Saving..."
                  disabled={!formData.title.trim()}
                  className="flex-1 h-8 text-xs"
                >
                  Save Action
                </LoadingButton>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Actions List */}
        <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : displayActions.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No {activeTab} actions
            </p>
          ) : (
            displayActions.map((action, i) => (
              <div
                key={action.id ?? i}
                className="flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                  <Activity className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {action.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {action.type}
                  </p>
                  {action.notes && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {action.notes}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
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
                      "w-4 h-4",
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
      <div className="p-4 border-t border-border bg-muted/10 mt-auto">
        <Button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={cn(
            "w-full h-10 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm",
            isFormOpen
              ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
              : "bg-emerald-600 text-white hover:bg-emerald-700",
          )}
        >
          {isFormOpen ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Action
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
