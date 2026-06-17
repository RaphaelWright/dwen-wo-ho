import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";

type FilterMatcher = (value: unknown, filterValue: string) => boolean;

function matchesExactFilter(value: unknown, filterValue: string): boolean {
  return String(value).toLowerCase() === filterValue.toLowerCase();
}

function matchesContainsFilter(value: unknown, filterValue: string): boolean {
  if (filterValue === "hasItems" && Array.isArray(value)) {
    return value.length > 0;
  }
  return String(value).toLowerCase().includes(filterValue.toLowerCase());
}

const SCORE_MATCHERS: Record<string, (value: unknown) => boolean> = {
  high: (value) => typeof value === "number" && value >= 5,
  top3: (value) => typeof value === "number" && value <= 3,
};

function matchesScoreFilter(value: unknown, filterValue: string): boolean {
  const matcher = SCORE_MATCHERS[filterValue];
  return matcher ? matcher(value) : true;
}

function matchesDateFilter(value: unknown, filterValue: string): boolean {
  if (filterValue !== "recent") return true;
  const createdDate = new Date(value as string | number | Date);
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return createdDate.getTime() >= sevenDaysAgo;
}

const FILTER_MATCHERS: Record<string, FilterMatcher> = {
  exact: matchesExactFilter,
  contains: matchesContainsFilter,
  score: matchesScoreFilter,
  date: matchesDateFilter,
};

function getFilterValue(
  item: object,
  filter: FilterOption,
): unknown | undefined {
  const record = item as Record<string, unknown>;
  if (!filter.filterKey) return undefined;
  return record[filter.filterKey];
}

function matchesNullFilterValue(filter: FilterOption): boolean {
  return !(
    filter.filterType === "contains" && filter.filterValue === "hasItems"
  );
}

function matchesTypedFilter(value: unknown, filter: FilterOption): boolean {
  const matcher = FILTER_MATCHERS[filter.filterType ?? ""];
  if (!matcher) return true;
  return matcher(value, filter.filterValue ?? "");
}

export function matchesFilterValue(
  value: unknown,
  filter: FilterOption,
): boolean {
  if (value === undefined || value === null) {
    return matchesNullFilterValue(filter);
  }
  return matchesTypedFilter(value, filter);
}

function matchesFilter(item: object, filter: FilterOption): boolean {
  if (!filter.filterKey || !filter.filterValue) return true;
  const value = getFilterValue(item, filter);
  return matchesFilterValue(value, filter);
}

export function matchesAllFilters(
  item: object,
  activeFilters: FilterOption[],
): boolean {
  return activeFilters.every((filter) => matchesFilter(item, filter));
}
