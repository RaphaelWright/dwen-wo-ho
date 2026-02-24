import { Users, Activity, FileText, CheckCircle } from "lucide-react";

export const REACH_SCHOOLS = [
  "Achimota High School",
  "Presbyterian Boys' Legon",
  "Wesley Girls' High School",
  "Holy Child School",
  "Mfantsipim School",
  "Prempeh College",
];

export const REACH_METRICS = [
  {
    label: "Visits",
    value: "0",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Screened",
    value: "0",
    icon: Activity,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    label: "Results",
    value: "0",
    icon: FileText,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    label: "Active",
    value: "0",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

export const REACH_ITEMS = {
  SCHOOLS: REACH_SCHOOLS,
  METRICS: REACH_METRICS,
};
