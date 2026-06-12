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
        className="border-input bg-background focus:ring-primary/20 flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
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
            className="bg-popover border-border absolute z-50 mt-1 w-full rounded-md border shadow-md"
          >
            {/* Search input */}
            <div className="border-border border-b p-2">
              <div className="relative">
                <Search
                  size={14}
                  className="text-muted-foreground absolute top-1/2 left-2 -translate-y-1/2"
                />
                <input
                  type="text"
                  aria-label="Search options"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full border-0 bg-transparent py-1.5 pr-3 pl-8 text-sm focus:ring-0 focus:outline-none"
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
                    className={`hover:bg-accent w-full px-3 py-2 text-left text-sm transition-colors ${
                      value === item
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ))
              ) : (
                <div className="text-muted-foreground px-3 py-2 text-center text-sm">
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
