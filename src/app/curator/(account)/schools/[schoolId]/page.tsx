"use client";

import { ROUTES } from "@/lib/constants/routes";
import { useCuratorSchoolDetails } from "@/hooks/curator/school-details/use-school-details";
import {
  SchoolDetailsErrorView,
  SchoolDetailsLoadingView,
} from "@/components/curator/school-details/page-states";
import { SchoolDetailsPageContent } from "@/components/curator/school-details/page-content";

export default function SchoolDetailsPage() {
  const details = useCuratorSchoolDetails();
  const { router, school, isLoading, error } = details;

  if (isLoading) {
    return <SchoolDetailsLoadingView />;
  }

  if (error || !school) {
    return (
      <SchoolDetailsErrorView
        error={error}
        onBack={() => router.push(ROUTES.curator.schools)}
      />
    );
  }

  return <SchoolDetailsPageContent details={details} />;
}
