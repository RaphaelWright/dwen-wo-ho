/**
 * Returns visual config for a patient status value.
 * @param {"urgent"|"new"|"action"|"follow-up"|"referred"|"ignored"} status
 */
export function getStatusConfig(status: string) {
  const map: Record<string, any> = {
    urgent: {
      label: "Urgent",
      cls: "bg-destructive/10 text-[#ef4444] border-[rgba(239,68,68,.25)]",
      bar: "#ef4444",
      actionLabel: "View Case",
    },
    new: {
      label: "New",
      cls: "bg-success/10 text-[#10b981] border-[rgba(16,185,129,.25)]",
      bar: "#10b981",
      actionLabel: "Open Case",
    },
    action: {
      label: "In Treatment",
      cls: "bg-primary/10 text-primary border-[rgba(139,92,246,.25)]",
      bar: "#8B5CF6",
      actionLabel: "Resume",
    },
    followUp: {
      label: "Follow-up",
      cls: "bg-amber-50 text-[#f59e0b] border-[rgba(245,158,11,.25)]",
      bar: "#f59e0b",
      actionLabel: "Review",
    },
    referred: {
      label: "Referred Out",
      cls: "bg-info/10 text-info border-[rgba(56,189,248,.25)]",
      bar: "#38bdf8",
      actionLabel: "View",
    },
    ignored: {
      label: "Ignored",
      cls: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/25",
      bar: "#555e72",
      actionLabel: "Action",
    },
  };
  return map[status.toLowerCase()] ?? map.ignored;
}

/** Score-ring colour per status */
/** * Locked-In Color Coding based on 0-10 score
 * 0.0 - 2.0: Black (Critical)
 * 2.1 - 4.0: Red (High Concern)
 * 4.1 - 6.0: Light Green (Mild Concern)
 * 6.1 - 8.0: Green (Healthy/Stable)
 * 8.1 - 10.0: Purple (Neutral/No Concern)
 */
export function getScoreColor(score: number | null) {
  if (score === null) return "#555e72"; // Default/Ignored

  if (score <= 2.0) return "#000000"; // Black: Critical
  if (score <= 4.0) return "#ef4444"; // Red: High Concern
  if (score <= 6.0) return "#90EE90"; // Light Green: Mild Concern
  if (score <= 8.0) return "#10b981"; // Green: Healthy
  return "var(--primary)"; // Purple: Neutral
}
