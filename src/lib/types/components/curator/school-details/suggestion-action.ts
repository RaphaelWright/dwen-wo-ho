import type { Route } from "next";
import type { SchoolTab } from "@/lib/types/components/curator/school-details/school-details";
import type { SchoolIcon } from "@/lib/types/entities/school";

export interface SchoolDetailsSuggestion {
  id?: string | number;
  email?: string;
}

export interface SchoolDetailsSuggestionActionContext {
  activeTab: SchoolTab;
  schoolId: string;
  schoolIcons: SchoolIcon[];
  router: { push: (href: Route) => void };
  handleProviderClick: (provider: { email: string }) => void;
  setEditingIcon: (icon: SchoolIcon | null) => void;
  setShowAddIconWizard: (open: boolean) => void;
}
