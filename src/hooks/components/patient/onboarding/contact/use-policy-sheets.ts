"use client";

import { useCallback, useState } from "react";

export type PolicySheetVariant = "canada-us" | "terms" | null;

export function usePolicySheets() {
  const [policySheet, setPolicySheet] = useState<PolicySheetVariant>(null);

  const openCanadaSheet = useCallback(() => {
    setPolicySheet("canada-us");
  }, []);

  const openTermsSheet = useCallback(() => {
    setPolicySheet("terms");
  }, []);

  const closePolicySheet = useCallback(() => {
    setPolicySheet(null);
  }, []);

  return {
    policySheet,
    openCanadaSheet,
    openTermsSheet,
    closePolicySheet,
    setPolicySheet,
  };
}
