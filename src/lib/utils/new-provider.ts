/**
 * Returns visual config for a patient status value.
 * @param {"urgent"|"new"|"action"|"follow-up"|"referred"|"ignored"} status
 */
export function getStatusConfig(status: string) {
  const map: Record<string, any> = {
    urgent: {
      label: "Urgent",
      cls: "bg-red-dim text-[#ef4444] border-[rgba(239,68,68,.25)]",
      bar: "#ef4444",
      actionLabel: "View Case",
    },
    new: {
      label: "New",
      cls: "bg-emerald-dim text-[#10b981] border-[rgba(16,185,129,.25)]",
      bar: "#10b981",
      actionLabel: "Open Case",
    },
    action: {
      label: "In Treatment",
      cls: "bg-violet-dim text-[#8B5CF6] border-[rgba(139,92,246,.25)]",
      bar: "#8B5CF6",
      actionLabel: "Resume",
    },
    "follow-up": {
      label: "Follow-up",
      cls: "bg-amber-dim text-[#f59e0b] border-[rgba(245,158,11,.25)]",
      bar: "#f59e0b",
      actionLabel: "Review",
    },
    referred: {
      label: "Referred Out",
      cls: "bg-sky-dim text-[#38bdf8] border-[rgba(56,189,248,.25)]",
      bar: "#38bdf8",
      actionLabel: "View",
    },
    ignored: {
      label: "Ignored",
      cls: "bg-[rgba(255,255,255,.05)] text-[#555e72] border-[rgba(255,255,255,.07)]",
      bar: "#555e72",
      actionLabel: "Action",
    },
  };
  return map[status] ?? map.ignored;
}

/** Score-ring colour per status */
export function getScoreColor(status: string) {
  const colors: Record<string, string> = {
    urgent: "#ef4444",
    new: "#10b981",
    action: "#8B5CF6",
    followUp: "#f59e0b",
    referred: "#38bdf8",
    ignored: "#555e72",
  };
  return colors[status] ?? "#555e72";
}
