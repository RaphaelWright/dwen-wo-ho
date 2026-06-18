"use client";

import { useCallback, useState } from "react";

export function useCreativeStudiosSubmit(
  submit: () => void | false | Promise<void | false>,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const shouldSubmit = submit();
    if (shouldSubmit === false) return;

    setIsSubmitting(true);
    try {
      await shouldSubmit;
    } finally {
      setIsSubmitting(false);
    }
  }, [submit]);

  return { isSubmitting, handleSubmit };
}
