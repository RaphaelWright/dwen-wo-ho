import { FiSearch } from "react-icons/fi";
import { ProviderSchoolsFilterProps } from "@/lib/types/provider/schools";
import { filterOptions } from "@/lib/constants/provider-schools";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProviderSchoolsFilter({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}: ProviderSchoolsFilterProps) {
  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <FiSearch className="text-muted-foreground h-5 w-5" />
          </div>
          <Input
            type="text"
            placeholder="Search schools by name, nickname, type, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-background border-input focus:ring-primary/20 focus:border-primary text-foreground placeholder-muted-foreground w-full rounded-xl border py-3 pr-4 pl-12 transition-all focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filterOptions.map((filter) => (
          <Button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
              activeFilter === filter.value
                ? "bg-primary text-primary-foreground shadow-primary/20 shadow-md"
                : "bg-background text-muted-foreground hover:bg-muted border-border border"
            }`}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </>
  );
}
