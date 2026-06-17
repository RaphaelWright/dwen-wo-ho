"use client";

import { useCallback, useRef, useState } from "react";
import { useCreativeStudiosFlowContext } from "@/hooks/components/curator/create/use-creative-studios-flow-context";
import { useCreativeStudiosMockStore } from "@/hooks/components/curator/create/use-creative-studios-mock-store";
import { useCreativeStudiosSubmit } from "@/hooks/components/curator/create/use-creative-studios-submit";

export function useTagForm() {
  const { tag, updateTag, submitTag } = useCreativeStudiosFlowContext();
  const { records } = useCreativeStudiosMockStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const tagRef = useRef<HTMLInputElement>(null);

  const setTitle = (val: string) => {
    updateTag({ title: val });
    if (errors.title) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.title;
        return next;
      });
    }
  };

  const addTag = () => {
    const val = tagRef.current?.value.trim();
    if (!val) return;
    if (tag.tags.some((t) => t.toLowerCase() === val.toLowerCase())) {
      setErrors({ ...errors, tag: "Already in this tag group" });
      return;
    }
    updateTag({ tags: [...tag.tags, val] });
    if (tagRef.current) tagRef.current.value = "";
    setErrors((prev) => {
      const next = { ...prev };
      delete next.tag;
      return next;
    });
  };

  const rmTag = (index: number) => {
    updateTag({ tags: tag.tags.filter((_, idx) => idx !== index) });
  };

  const mvTag = (index: number, dir: number) => {
    const nextIndex = index + dir;
    if (nextIndex < 0 || nextIndex >= tag.tags.length) return;
    const nextTags = [...tag.tags];
    [nextTags[index], nextTags[nextIndex]] = [
      nextTags[nextIndex],
      nextTags[index],
    ];
    updateTag({ tags: nextTags });
  };

  const validate = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    const title = tag.title.trim();
    if (!title) nextErrors.title = "Main title is required";
    else if (
      records.tags.some((r) => r.title.toLowerCase() === title.toLowerCase())
    ) {
      nextErrors.title = "A tag group with this title already exists";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [records.tags, tag.title]);

  const submitWithValidation = useCallback(() => {
    if (!validate()) return false;
    submitTag();
  }, [submitTag, validate]);

  const { isSubmitting, handleSubmit } =
    useCreativeStudiosSubmit(submitWithValidation);

  return {
    tag,
    errors,
    tagRef,
    setTitle,
    addTag,
    rmTag,
    mvTag,
    validate,
    isSubmitting,
    handleCreate: handleSubmit,
  };
}
