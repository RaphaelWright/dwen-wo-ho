"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { IoBookOutline } from "react-icons/io5";
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
import { useProgrammeCombobox } from "@/hooks/components/patient/onboarding/programme-combobox/use-programme-combobox";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type {
  ProgrammeComboboxItem,
  ProgrammeComboboxProps,
} from "@/lib/types/components/patient/onboarding";

function ProgrammeComboboxOption({ item }: { item: ProgrammeComboboxItem }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-md border sm:size-8">
        <IoBookOutline className="size-3.5 sm:size-4" aria-hidden="true" />
      </span>
      <span className="truncate">{item.label}</span>
    </div>
  );
}

export function ProgrammeCombobox({
  selectedProgramme,
  disabled,
  onSelectProgramme,
}: ProgrammeComboboxProps) {
  const { items, selectedItem } = useProgrammeCombobox(selectedProgramme);

  const handleClear = () => {
    onSelectProgramme("");
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

        onSelectProgramme(item.value);
      }}
      disabled={disabled}
    >
      <div className="flex flex-col items-end gap-1.5">
        <InputGroup className="w-full">
          <ComboboxPrimitive.Input
            render={
              <InputGroupInput id="patient-programme" disabled={disabled} />
            }
            placeholder={ONBOARDING_COPY.programme.placeholder}
          />
          <InputGroupAddon align="inline-end">
            {selectedItem ? (
              <span className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-md border">
                <IoBookOutline className="size-4" aria-hidden="true" />
              </span>
            ) : (
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                asChild
                data-slot="input-group-button"
                disabled={disabled}
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
            {ONBOARDING_COPY.programme.clearProgramme}
          </Button>
        ) : null}
      </div>

      <ComboboxContent>
        <ComboboxEmpty>{ONBOARDING_COPY.programme.emptyResults}</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              <ProgrammeComboboxOption item={item} />
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
