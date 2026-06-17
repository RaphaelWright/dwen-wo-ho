"use client";

import { ArrowDown, ArrowRight, ArrowUp, Trash2 } from "lucide-react";
import { ErrorMsg } from "@/components/curator/create/creative-studios/shared/error-msg";
import { LoadingButton } from "@/components/ui/loading-button";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { useTagForm } from "@/hooks/components/curator/create/tag/use-tag-form";
import { escapeHtml } from "@/lib/utils/curator/create/escape-html";

export function TagForm() {
  const {
    tag,
    errors,
    tagRef,
    setTitle,
    addTag,
    rmTag,
    mvTag,
    isSubmitting,
    handleCreate,
  } = useTagForm();

  return (
    <div className="cs-page-enter p-4 md:p-8">
      <h2 className="text-foreground text-2xl font-semibold tracking-tight">
        Create New Tag
      </h2>
      <p className="text-muted-foreground mt-1 mb-6 text-sm">
        Build a tag group with individual tags
      </p>

      <FieldGroup className="max-w-md gap-4">
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="tag-title" className="text-xs font-semibold">
            Main Title <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="tag-title"
            value={tag.title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Subjects, Grades, Departments"
            aria-invalid={!!errors.title}
          />
          <ErrorMsg msg={errors.title ?? ""} />
        </Field>

        <Field data-invalid={!!errors.tag}>
          <FieldLabel htmlFor="tag-entry" className="text-xs font-semibold">
            Tags
          </FieldLabel>
          <InputGroup className="border-input focus-within:border-primary/60 rounded-lg border transition-all duration-200">
            <InputGroupInput
              id="tag-entry"
              ref={tagRef}
              placeholder="Press Enter to add a tag"
              aria-invalid={!!errors.tag}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-sm"
                className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full"
                onClick={addTag}
                aria-label="Add tag"
              >
                <ArrowRight data-icon="inline-start" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <ErrorMsg msg={errors.tag ?? ""} />
          {tag.tags.length > 0 ? (
            <p className="text-muted-foreground text-[11px]">
              Use arrows to reorder or remove tags
            </p>
          ) : null}
        </Field>

        <div className="space-y-1.5">
          {tag.tags.map((tagLabel, i) => (
            <div
              key={`${tagLabel}-${i}`}
              className="flex items-center gap-3 transition-all duration-200"
            >
              <div className="bg-foreground text-background flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
                {i + 1}
              </div>
              <div className="bg-primary/10 text-primary flex flex-1 items-center justify-between rounded-lg px-3 py-2 text-sm font-medium">
                <span>{escapeHtml(tagLabel)}</span>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => mvTag(i, -1)}
                    disabled={i === 0}
                    className="text-primary hover:bg-primary/10"
                    aria-label="Move tag up"
                  >
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => mvTag(i, 1)}
                    disabled={i === tag.tags.length - 1}
                    className="text-primary hover:bg-primary/10"
                    aria-label="Move tag down"
                  >
                    <ArrowDown className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => rmTag(i)}
                    className="text-destructive hover:bg-destructive/10"
                    aria-label="Remove tag"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <LoadingButton
          type="button"
          onClick={handleCreate}
          loading={isSubmitting}
          loadingText="Creating..."
          className="bg-primary mt-2 w-full rounded-xl py-2.5 font-medium transition-all duration-200 hover:-translate-y-px active:translate-y-0"
        >
          Create Tag Group
        </LoadingButton>
      </FieldGroup>
    </div>
  );
}
