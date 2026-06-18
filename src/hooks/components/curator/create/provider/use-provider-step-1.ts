"use client";

import { useRef, useState } from "react";
import { useCreativeStudiosFlowContext } from "@/hooks/components/curator/create/use-creative-studios-flow-context";

export function useProviderStep1() {
  const { provider, updateProvider } = useCreativeStudiosFlowContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nickRef = useRef<HTMLInputElement>(null);

  const setField = (field: keyof typeof provider, value: string | boolean) => {
    updateProvider({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const addNick = () => {
    const val = nickRef.current?.value.trim();
    if (!val) return;
    if (provider.nicks.some((n) => n.toLowerCase() === val.toLowerCase())) {
      setErrors({ ...errors, nick: "Already added" });
      return;
    }
    updateProvider({ nicks: [...provider.nicks, val] });
    if (nickRef.current) nickRef.current.value = "";
    setErrors((prev) => {
      const next = { ...prev };
      delete next.nick;
      return next;
    });
  };

  const rmNick = (index: number) => {
    updateProvider({ nicks: provider.nicks.filter((_, idx) => idx !== index) });
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const name = provider.name.trim();
    if (!name) nextErrors.name = "Full name is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  return {
    provider,
    errors,
    nickRef,
    setField,
    addNick,
    rmNick,
    validate,
  };
}
