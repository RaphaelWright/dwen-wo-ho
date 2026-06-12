import { MdSchool } from "react-icons/md";
import { SchoolCard } from "./SchoolCard";
import { ProviderSchoolsListProps } from "@/lib/types/provider/schools";
import { filterOptions } from "@/lib/constants/provider-schools";

export function ProviderSchoolsList({
  schools,
  isLoading,
  activeFilter,
  onSchoolClick,
}: ProviderSchoolsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading schools...</p>
        </div>
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="py-20 text-center">
        <MdSchool className="text-muted-foreground/30 mx-auto mb-4 h-16 w-16" />
        <h3 className="text-foreground mb-2 text-xl font-semibold">
          {activeFilter === "all" ? "No schools assigned" : "No schools found"}
        </h3>
        <p className="text-muted-foreground">
          {activeFilter === "all"
            ? "You haven't been assigned to any schools yet."
            : `There are no schools under the ${
                filterOptions.find((f) => f.value === activeFilter)?.label
              } category.`}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {schools.map((school) => (
        <SchoolCard key={school.id} school={school} onClick={onSchoolClick} />
      ))}
    </div>
  );
}
