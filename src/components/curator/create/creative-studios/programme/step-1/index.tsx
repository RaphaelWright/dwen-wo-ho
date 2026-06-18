"use client";

import { ArrowRight } from "lucide-react";
import { Chip } from "@/components/curator/create/creative-studios/shared/chip";
import { ErrorMsg } from "@/components/curator/create/creative-studios/shared/error-msg";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatProgrammeSchoolYearLabel } from "@/lib/constants/components/curator/create/creative-studios";
import { useProgrammeStep1 } from "@/hooks/components/curator/create/programme/use-programme-step-1";

export function ProgrammeStep1() {
  const {
    programme,
    errors,
    nickRef,
    setField,
    setYearFrom,
    setYearTo,
    addNick,
    rmNick,
    handleNext,
    yearFromOptions,
    yearToOptions,
  } = useProgrammeStep1();

  return (
    <div className="cs-page-enter p-4 md:p-8">
      <h2 className="text-foreground text-2xl font-semibold tracking-tight">
        Create New Programme
      </h2>
      <p className="text-muted-foreground mt-1 mb-6 text-sm">
        Set up the academic programme
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleNext();
        }}
      >
        <FieldGroup className="max-w-md gap-4">
          <Field data-invalid={!!errors.name}>
            <FieldLabel
              htmlFor="programme-name"
              className="text-xs font-semibold"
            >
              Full Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="programme-name"
              value={programme.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Programme name"
              aria-invalid={!!errors.name}
            />
            <ErrorMsg msg={errors.name ?? ""} />
          </Field>

          <Field data-invalid={!!errors.nick}>
            <FieldLabel
              htmlFor="programme-nick"
              className="text-xs font-semibold"
            >
              Nicknames
            </FieldLabel>
            <InputGroup className="border-input focus-within:border-primary/60 rounded-lg border transition-all duration-200">
              <InputGroupInput
                id="programme-nick"
                ref={nickRef}
                placeholder="Press Enter to add"
                aria-invalid={!!errors.nick}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addNick();
                  }
                }}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-sm"
                  className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full"
                  onClick={addNick}
                  aria-label="Add nickname"
                >
                  <ArrowRight data-icon="inline-start" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <ErrorMsg msg={errors.nick ?? ""} />
            {programme.nicks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {programme.nicks.map((n, i) => (
                  <Chip
                    key={n}
                    label={n}
                    color="purple"
                    onRemove={() => rmNick(i)}
                  />
                ))}
              </div>
            ) : null}
          </Field>

          <Field>
            <FieldLabel
              htmlFor="programme-bio"
              className="text-xs font-semibold"
            >
              Bio
            </FieldLabel>
            <Textarea
              id="programme-bio"
              className="min-h-20 resize-y"
              value={programme.bio}
              onChange={(e) => setField("bio", e.target.value)}
              placeholder="Programme description"
            />
          </Field>

          <Field data-invalid={!!errors.dur}>
            <FieldLabel className="text-xs font-semibold">
              Duration (school years)
            </FieldLabel>
            <div className="flex items-center gap-3">
              <Select
                value={String(programme.durationFromYear)}
                onValueChange={(value) => setYearFrom(Number(value))}
              >
                <SelectTrigger className="w-full" aria-invalid={!!errors.dur}>
                  <SelectValue placeholder="From year" />
                </SelectTrigger>
                <SelectContent>
                  {yearFromOptions.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {formatProgrammeSchoolYearLabel(year)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground shrink-0 text-xs font-medium">
                to
              </span>
              <Select
                value={String(programme.durationToYear)}
                onValueChange={(value) => setYearTo(Number(value))}
              >
                <SelectTrigger className="w-full" aria-invalid={!!errors.dur}>
                  <SelectValue placeholder="To year" />
                </SelectTrigger>
                <SelectContent>
                  {yearToOptions.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {formatProgrammeSchoolYearLabel(year)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ErrorMsg msg={errors.dur ?? ""} />
          </Field>

          <Button
            type="submit"
            className="bg-primary mt-2 w-full rounded-xl py-2.5 font-medium transition-all duration-200 hover:-translate-y-px active:translate-y-0"
          >
            Next
            <ArrowRight data-icon="inline-end" />
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
