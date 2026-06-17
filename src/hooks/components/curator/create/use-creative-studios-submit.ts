"use client";

import { useCallback, useState } from "react";

export function useCreativeStudiosSubmit(submit: () => void | false) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(() => {
    const shouldSubmit = submit();
    if (shouldSubmit === false) return;
    setIsSubmitting(true);
  }, [submit]);

  return { isSubmitting, handleSubmit };
}
