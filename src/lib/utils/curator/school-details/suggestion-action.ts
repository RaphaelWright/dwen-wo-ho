import type { Route } from "next";
import { DYNAMIC_ROUTES } from "@/lib/constants/routes";
import type {
  SchoolDetailsSuggestion,
  SchoolDetailsSuggestionActionContext,
} from "@/lib/types/components/curator/school-details/suggestion-action";
import type { SchoolIcon } from "@/lib/types/entities/school";

export type { SchoolDetailsSuggestion, SchoolDetailsSuggestionActionContext };

function openPatientFromSuggestion(
  suggestion: SchoolDetailsSuggestion,
  schoolId: string,
  router: SchoolDetailsSuggestionActionContext["router"],
): void {
  if (!suggestion.id) return;
  router.push(
    DYNAMIC_ROUTES.curator.patientDetails(schoolId, suggestion.id) as Route,
  );
}

function openProviderFromSuggestion(
  suggestion: SchoolDetailsSuggestion,
  handleProviderClick: SchoolDetailsSuggestionActionContext["handleProviderClick"],
): void {
  if (!suggestion.email) return;
  handleProviderClick({ email: suggestion.email });
}

function openIconFromSuggestion(
  suggestion: SchoolDetailsSuggestion,
  schoolIcons: SchoolIcon[],
  setEditingIcon: SchoolDetailsSuggestionActionContext["setEditingIcon"],
  setShowAddIconWizard: SchoolDetailsSuggestionActionContext["setShowAddIconWizard"],
): void {
  if (suggestion.id == null) return;
  const icon = schoolIcons.find((i) => String(i.id) === String(suggestion.id));
  if (!icon) return;
  setEditingIcon(icon);
  setShowAddIconWizard(true);
}

export function runSchoolDetailsSuggestionAction(
  suggestion: SchoolDetailsSuggestion,
  ctx: SchoolDetailsSuggestionActionContext,
): void {
  if (ctx.activeTab === "patients") {
    openPatientFromSuggestion(suggestion, ctx.schoolId, ctx.router);
    return;
  }
  if (ctx.activeTab === "providers") {
    openProviderFromSuggestion(suggestion, ctx.handleProviderClick);
    return;
  }
  if (ctx.activeTab === "icons") {
    openIconFromSuggestion(
      suggestion,
      ctx.schoolIcons,
      ctx.setEditingIcon,
      ctx.setShowAddIconWizard,
    );
  }
}
