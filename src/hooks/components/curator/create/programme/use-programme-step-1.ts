"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCreativeStudiosFlowContext } from "@/hooks/components/curator/create/use-creative-studios-flow-context";
import { useCreativeStudiosMockStore } from "@/hooks/components/curator/create/use-creative-studios-mock-store";
import { useCreativeStudiosNavigation } from "@/hooks/components/curator/create/use-creative-studios-navigation";
import {
  getProgrammeWeekFromOptions,
  getProgrammeWeekToOptions,
  reconcileProgrammeWeekFrom,
  reconcileProgrammeWeeks,
  reconcileProgrammeWeekTo,
} from "@/lib/utils/curator/create/reconcile-programme-weeks";

function clearDurationError(
  errors: Record<string, string>,
): Record<string, string> {
  if (!errors.dur) return errors;
  const next = { ...errors };
  delete next.dur;
  return next;
}

export function useProgrammeStep1() {
  const { programme, updateProgramme } = useCreativeStudiosFlowContext();
  const { records } = useCreativeStudiosMockStore();
  const { goNext } = useCreativeStudiosNavigation("programme");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nickRef = useRef<HTMLInputElement>(null);
  const programmeRef = useRef(programme);

  programmeRef.current = programme;

  const weekFromOptions = useMemo(
    () => getProgrammeWeekFromOptions(programme.dt),
    [programme.dt],
  );

  const weekToOptions = useMemo(
    () => getProgrammeWeekToOptions(programme.df),
    [programme.df],
  );

  useEffect(() => {
    const { df, dt } = reconcileProgrammeWeeks(programme.df, programme.dt);
    if (df !== programme.df || dt !== programme.dt) {
      updateProgramme({ df, dt });
    }
  }, [programme.df, programme.dt, updateProgramme]);

  const setField = (field: keyof typeof programme, value: string | number) => {
    updateProgramme({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const setWeekFrom = (df: number) => {
    updateProgramme(reconcileProgrammeWeekFrom(df, programme.dt));
    setErrors((prev) => clearDurationError(prev));
  };

  const setWeekTo = (dt: number) => {
    updateProgramme(reconcileProgrammeWeekTo(programme.df, dt));
    setErrors((prev) => clearDurationError(prev));
  };

  const addNick = () => {
    const val = nickRef.current?.value.trim();
    if (!val) return;
    if (programme.nicks.some((n) => n.toLowerCase() === val.toLowerCase())) {
      setErrors({ ...errors, nick: "Already added" });
      return;
    }
    if (
      records.programmes
        .flatMap((r) => r.nicks)
        .some((n) => n.toLowerCase() === val.toLowerCase())
    ) {
      setErrors({ ...errors, nick: "Nickname used by another programme" });
      return;
    }
    updateProgramme({ nicks: [...programme.nicks, val] });
    if (nickRef.current) nickRef.current.value = "";
    setErrors((prev) => {
      const next = { ...prev };
      delete next.nick;
      return next;
    });
  };

  const rmNick = (index: number) => {
    updateProgramme({
      nicks: programme.nicks.filter((_, idx) => idx !== index),
    });
  };

  const validate = useCallback(() => {
    const current = programmeRef.current;
    const nextErrors: Record<string, string> = {};
    const name = current.name.trim();
    if (!name) nextErrors.name = "Full name is required";
    else if (
      records.programmes.some(
        (r) => r.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      nextErrors.name = "A programme with this name already exists";
    }
    if (current.df >= current.dt) {
      nextErrors.dur = '"To" week must be after "From" week';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [records.programmes]);

  const handleNext = useCallback(() => {
    if (!validate()) return;
    goNext();
  }, [goNext, validate]);

  return {
    programme,
    errors,
    nickRef,
    setField,
    setWeekFrom,
    setWeekTo,
    addNick,
    rmNick,
    handleNext,
    weekFromOptions,
    weekToOptions,
  };
}
