"use client";

import { useRef, useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { ChevronDown, Search } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { SearchableSelectFieldProps } from "@/lib/types/components/provider/edit-field";

export function SearchableSelectField({
  value,
  onChange,
  label,
  items,
}: SearchableSelectFieldProps) {
  const [selectOpen, setSelectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  useClickOutside(selectRef, () => setSelectOpen(false));

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="relative mb-2" ref={selectRef}>
      <button
        type="button"
        onClick={() => setSelectOpen(!selectOpen)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || `Select ${label?.toLowerCase() || "value"}`}
        </span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform ${selectOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {selectOpen && (
          <m.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md"
          >
            {/* Search input */}
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  aria-label="Search options"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Items list - scrollable with native scrollbar */}
            <div className="max-h-52 overflow-y-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      onChange(item);
                      setSelectOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                      value === item
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                  No {label?.toLowerCase()} found.
                </div>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
