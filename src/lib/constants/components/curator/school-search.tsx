import {
  AlertCircle,
  Clock,
  Send,
  Archive,
  Lock,
  Star,
  CheckCircle,
} from "lucide-react";
import type { SchoolTab } from "@/lib/types/components/curator/school-details";

export const SCHOOL_SEARCH_QUICK_FILTERS: Record<SchoolTab, any[]> = {
  patients: [
    {
      id: "urgent",
      label: "Urgent",
      icon: (
        <AlertCircle className="size-4 text-rose-500/80 group-hover:text-rose-500" />
      ),
    },
    {
      id: "follow-up",
      label: "Follow-up",
      icon: (
        <Clock className="size-4 text-amber-500/80 group-hover:text-amber-500" />
      ),
    },
    {
      id: "referred",
      label: "Referred",
      icon: (
        <Send className="size-4 text-sky-500/80 group-hover:text-sky-500" />
      ),
    },
    {
      id: "ignored",
      label: "Ignored",
      icon: (
        <Archive className="size-4 text-slate-500/80 group-hover:text-slate-500" />
      ),
    },
  ],
  icons: [
    {
      id: "ready",
      label: "Locked In",
      icon: (
        <Lock className="size-4 text-indigo-500/80 group-hover:text-indigo-500" />
      ),
    },
    {
      id: "top",
      label: "Top Ranked",
      icon: (
        <Star className="size-4 text-amber-500/80 group-hover:text-amber-500" />
      ),
    },
  ],
  providers: [
    {
      id: "approved",
      label: "Approved",
      icon: (
        <CheckCircle className="size-4 text-emerald-500/80 group-hover:text-emerald-500" />
      ),
    },
  ],
};
