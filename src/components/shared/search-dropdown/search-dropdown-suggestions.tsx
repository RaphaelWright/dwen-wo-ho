"use client";

import { m } from "motion/react";
import { Search } from "lucide-react";
import type { ComponentType } from "react";

interface SearchDropdownSuggestionsProps<T extends object> {
  suggestions: T[];
  quickFiltersCount: number;
  emptySuggestionsMessage: string;
  getSuggestionValue?: (item: T) => string;
  renderSuggestion: ComponentType<T>;
  onSuggestionClick: (item: T) => void;
}

export function SearchDropdownSuggestions<T extends object>({
  suggestions,
  quickFiltersCount,
  emptySuggestionsMessage,
  getSuggestionValue,
  renderSuggestion: RenderSuggestion,
  onSuggestionClick,
}: SearchDropdownSuggestionsProps<T>) {
  return (
    <div className={quickFiltersCount > 0 ? "mb-5" : ""}>
      <h4 className="text-muted-foreground/80 mb-3 px-1 text-[10px] font-bold tracking-widest uppercase">
        Suggestions
      </h4>
      <div className="space-y-1">
        {suggestions.length > 0 ? (
          suggestions.map((item) => (
            <m.div
              key={
                getSuggestionValue
                  ? getSuggestionValue(item)
                  : JSON.stringify(item)
              }
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestionClick(item)}
              className="hover:border-border/50 hover:bg-muted/60 cursor-pointer rounded-2xl border border-transparent p-2.5 transition-colors"
            >
              <RenderSuggestion {...item} />
            </m.div>
          ))
        ) : (
          <div className="border-border/60 bg-muted/20 flex flex-col items-center justify-center rounded-2xl border border-dashed py-10 text-center">
            <Search className="text-muted-foreground/40 mb-2 size-6" />
            <div className="text-muted-foreground text-[13px] font-medium">
              {emptySuggestionsMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
