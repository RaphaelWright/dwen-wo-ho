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
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search schools by name, nickname, type, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filterOptions.map((filter) => (
          <Button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeFilter === filter.value
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-background text-muted-foreground hover:bg-muted border border-border"
            }`}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </>
  );
}
