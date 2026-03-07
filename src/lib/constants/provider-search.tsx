import { Clock, Send, Archive, Siren } from "lucide-react";

export const PROVIDER_SEARCH_QUICK_FILTERS = [
  {
    id: "urgent",
    label: "Urgent",
    icon: (
      <Siren className="size-4 text-destructive group-hover:text-destructive/50" />
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
    icon: <Send className="size-4 text-sky-500/80 group-hover:text-sky-500" />,
  },
  {
    id: "ignored",
    label: "Ignored",
    icon: (
      <Archive className="size-4 text-slate-500/80 group-hover:text-slate-500" />
    ),
  },
];
