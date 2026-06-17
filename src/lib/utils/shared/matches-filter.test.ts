import { describe, expect, it } from "vitest";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";
import { matchesAllFilters } from "./matches-filter";

const exactFilter: FilterOption = {
  id: "type-jhs",
  label: "JHS",
  filterKey: "type",
  filterValue: "JHS",
  filterType: "exact",
};

const containsFilter: FilterOption = {
  id: "name-a",
  label: "A",
  filterKey: "name",
  filterValue: "alpha",
  filterType: "contains",
};

const hasItemsFilter: FilterOption = {
  id: "has-lockins",
  label: "Has lock-ins",
  filterKey: "lockIns",
  filterValue: "hasItems",
  filterType: "contains",
};

const highScoreFilter: FilterOption = {
  id: "high-score",
  label: "High",
  filterKey: "rank",
  filterValue: "high",
  filterType: "score",
};

const top3Filter: FilterOption = {
  id: "top-ranked",
  label: "Top 3",
  filterKey: "rank",
  filterValue: "top3",
  filterType: "score",
};

describe("matchesAllFilters", () => {
  it("matches exact values case-insensitively", () => {
    expect(matchesAllFilters({ type: "jhs" }, [exactFilter])).toBe(true);
    expect(matchesAllFilters({ type: "SHS" }, [exactFilter])).toBe(false);
  });

  it("matches contains filters", () => {
    expect(matchesAllFilters({ name: "Alpha School" }, [containsFilter])).toBe(
      true,
    );
    expect(matchesAllFilters({ name: "Beta School" }, [containsFilter])).toBe(
      false,
    );
  });

  it("treats missing hasItems arrays as non-matching", () => {
    expect(matchesAllFilters({ lockIns: [] }, [hasItemsFilter])).toBe(false);
    expect(matchesAllFilters({ lockIns: [1] }, [hasItemsFilter])).toBe(true);
    expect(matchesAllFilters({}, [hasItemsFilter])).toBe(false);
  });

  it("applies score thresholds", () => {
    expect(matchesAllFilters({ rank: 6 }, [highScoreFilter])).toBe(true);
    expect(matchesAllFilters({ rank: 4 }, [highScoreFilter])).toBe(false);
    expect(matchesAllFilters({ rank: 2 }, [top3Filter])).toBe(true);
    expect(matchesAllFilters({ rank: 4 }, [top3Filter])).toBe(false);
  });

  it("matches recent date filters within seven days", () => {
    const recentFilter: FilterOption = {
      id: "recent",
      label: "Recent",
      filterKey: "createdAt",
      filterValue: "recent",
      filterType: "date",
    };
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

    expect(
      matchesAllFilters({ createdAt: threeDaysAgo.toISOString() }, [
        recentFilter,
      ]),
    ).toBe(true);
    expect(
      matchesAllFilters({ createdAt: tenDaysAgo.toISOString() }, [
        recentFilter,
      ]),
    ).toBe(false);
  });

  it("requires every active filter to match", () => {
    const school = { type: "JHS", name: "Alpha High" };

    expect(matchesAllFilters(school, [exactFilter, containsFilter])).toBe(true);
    expect(
      matchesAllFilters(school, [
        exactFilter,
        { ...containsFilter, filterValue: "beta" },
      ]),
    ).toBe(false);
  });

  it("passes when filter metadata is incomplete", () => {
    expect(
      matchesAllFilters({ type: "JHS" }, [
        { id: "noop", label: "Noop", filterKey: undefined },
      ]),
    ).toBe(true);
  });

  it("uses the default branch for unknown filter types", () => {
    expect(
      matchesAllFilters({ type: "JHS" }, [
        {
          id: "custom",
          label: "Custom",
          filterKey: "type",
          filterValue: "SHS",
          filterType: "bogus" as FilterOption["filterType"],
        },
      ]),
    ).toBe(true);
  });
});
