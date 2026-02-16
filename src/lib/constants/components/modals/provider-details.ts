import { FiFileText, FiAward, FiUsers } from "react-icons/fi";
import { ProviderDetailsTab } from "@/lib/types/modals";

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
