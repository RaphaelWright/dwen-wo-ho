"use client";

import { ArrowRight } from "lucide-react";
import { ProviderClinicalToggle } from "@/components/curator/create/creative-studios/provider/clinical-toggle";
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
import { Textarea } from "@/components/ui/textarea";
import { useProviderStep1 } from "@/hooks/components/curator/create/provider/use-provider-step-1";
import { useCreativeStudiosNavigation } from "@/hooks/components/curator/create/use-creative-studios-navigation";

export function ProviderStep1() {
  const { goNext } = useCreativeStudiosNavigation("provider");
  const { provider, errors, nickRef, setField, addNick, rmNick, validate } =
    useProviderStep1();

  return (
    <div className="cs-page-enter p-4 md:p-8">
      <h2 className="text-foreground text-2xl font-semibold tracking-tight">
        Create New Provider
      </h2>
      <p className="text-muted-foreground mt-1 mb-6 text-sm">
        Enter the provider&apos;s details
      </p>

      <FieldGroup className="max-w-md gap-4">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="provider-name" className="text-xs font-semibold">
            Full Name <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="provider-name"
            value={provider.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Provider full name"
            aria-invalid={!!errors.name}
          />
          <ErrorMsg msg={errors.name ?? ""} />
        </Field>

        <Field data-invalid={!!errors.nick}>
          <FieldLabel htmlFor="provider-nick" className="text-xs font-semibold">
            Nicknames
          </FieldLabel>
          <InputGroup className="border-input focus-within:border-primary/60 rounded-lg border transition-all duration-200">
            <InputGroupInput
              id="provider-nick"
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
          {provider.nicks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {provider.nicks.map((n, i) => (
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

        <Field data-invalid={!!errors.bio}>
          <FieldLabel htmlFor="provider-bio" className="text-xs font-semibold">
            Bio
          </FieldLabel>
          <Textarea
            id="provider-bio"
            className="min-h-20 resize-y"
            value={provider.bio}
            onChange={(e) => setField("bio", e.target.value)}
            placeholder="Brief biography or description"
            aria-invalid={!!errors.bio}
          />
        </Field>

        <Field>
          <FieldLabel className="text-xs font-semibold">
            Clinical mode
          </FieldLabel>
          <ProviderClinicalToggle
            checked={provider.clinical}
            onChange={(checked) => setField("clinical", checked)}
          />
          <p className="text-muted-foreground mt-2 text-center text-[11px]">
            Click to turn it {provider.clinical ? "off" : "on"}
          </p>
        </Field>

        <Button
          type="button"
          onClick={() => {
            if (validate()) goNext();
          }}
          className="bg-primary mt-2 w-full rounded-xl py-2.5 font-medium transition-all duration-200 hover:-translate-y-px active:translate-y-0"
        >
          Next
          <ArrowRight data-icon="inline-end" />
        </Button>
      </FieldGroup>
    </div>
  );
}
