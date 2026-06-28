"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSchoolCombobox } from "@/hooks/components/patient/onboarding/school-combobox/use-school-combobox";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type {
  SchoolComboboxItem,
  SchoolComboboxProps,
} from "@/lib/types/components/patient/onboarding";

function schoolShortLabel(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function SchoolAvatar({
  item,
  className,
}: {
  item: SchoolComboboxItem;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      {item.logo ? <AvatarImage src={item.logo} alt="" /> : null}
      <AvatarFallback className="rounded-md text-xs font-semibold">
        {schoolShortLabel(item.label)}
      </AvatarFallback>
    </Avatar>
  );
}

function SchoolComboboxOption({ item }: { item: SchoolComboboxItem }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <SchoolAvatar
        item={item}
        className="size-6 shrink-0 rounded-md border sm:size-8"
      />
      <span className="truncate">{item.label}</span>
    </div>
  );
}

export function SchoolCombobox({
  schoolType,
  selectedSchoolId,
  disabled,
  onSelectSchool,
}: SchoolComboboxProps) {
  const { items, selectedItem, isLoading } = useSchoolCombobox(
    schoolType,
    selectedSchoolId,
  );

  const fieldDisabled = disabled || !schoolType || isLoading;

  const handleClear = () => {
    onSelectSchool({ id: "", name: "" });
  };

  return (
    <Combobox
      items={items}
      value={selectedItem}
      onValueChange={(item) => {
        if (!item || Array.isArray(item)) {
          handleClear();
          return;
        }

        onSelectSchool({ id: item.value, name: item.label });
      }}
      disabled={fieldDisabled}
    >
      <div className="flex flex-col items-end gap-1.5">
        <InputGroup className="h-8 w-full sm:h-10">
          <ComboboxPrimitive.Input
            render={
              <InputGroupInput
                id="patient-school"
                disabled={fieldDisabled}
                className="h-full min-h-0 py-0 text-sm"
              />
            }
            placeholder={
              isLoading
                ? ONBOARDING_COPY.schoolType.pickerLoading
                : ONBOARDING_COPY.schoolType.pickerPlaceholder
            }
          />
          <InputGroupAddon align="inline-end">
            {selectedItem ? (
              <SchoolAvatar
                item={selectedItem}
                className="size-6 shrink-0 rounded-md border sm:size-7"
              />
            ) : (
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                asChild
                data-slot="input-group-button"
                disabled={fieldDisabled}
              >
                <ComboboxTrigger />
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>

        {selectedItem ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-auto px-2 py-0"
            onClick={handleClear}
          >
            {ONBOARDING_COPY.schoolType.clearSchool}
          </Button>
        ) : null}
      </div>

      <ComboboxContent>
        {isLoading ? (
          <div className="flex flex-col gap-2 p-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-muted/60 h-8 w-full animate-pulse rounded-md sm:h-10"
              />
            ))}
          </div>
        ) : (
          <>
            <ComboboxEmpty>
              {ONBOARDING_COPY.schoolType.emptyResults}
            </ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  <SchoolComboboxOption item={item} />
                </ComboboxItem>
              )}
            </ComboboxList>
          </>
        )}
      </ComboboxContent>
    </Combobox>
  );
}
