import { FiFileText, FiAward, FiUsers } from "react-icons/fi";

export const PROVIDER_DETAILS_TAB_VALUES = [
  "overview",
  "schools",
  "partners",
] as const;

type ProviderDetailsTab = (typeof PROVIDER_DETAILS_TAB_VALUES)[number];

export const PROVIDER_DETAILS_TABS = [
  {
    id: "overview" as ProviderDetailsTab,
    label: "Overview",
    icon: FiFileText,
  },
  {
    id: "schools" as ProviderDetailsTab,
    label: "Schools",
    icon: FiAward,
  },
  {
    id: "partners" as ProviderDetailsTab,
    label: "Partners",
    icon: FiUsers,
  },
];

export const PROVIDER_STATUS_CONFIG = {
  PENDING: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  APPROVED: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  REJECTED: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
} as const;
