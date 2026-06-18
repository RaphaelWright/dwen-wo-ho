"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreativeStudiosFlowContext } from "@/hooks/components/curator/create/use-creative-studios-flow-context";
import { useCreativeStudiosNavigation } from "@/hooks/components/curator/create/use-creative-studios-navigation";
import {
  CAMPUS_LOCATION_OPTIONS,
  CAMPUS_TYPE_OPTIONS,
} from "@/lib/constants/components/curator/create/creative-studios";
import {
  campusStep1Schema,
  type CampusStep1FormValues,
} from "@/lib/schemas/creative-studios/campus-step-1";

export function useCampusStep1() {
  const { campus, updateCampus } = useCreativeStudiosFlowContext();
  const { goNext } = useCreativeStudiosNavigation("campus");
  const [nickError, setNickError] = useState("");
  const nickRef = useRef<HTMLInputElement>(null);

  const defaultValues = useMemo(
    (): CampusStep1FormValues => ({
      name: campus.name,
      motto: campus.motto,
      type: campus.type,
      location: campus.location,
    }),
    [campus.name, campus.motto, campus.type, campus.location],
  );

  const form = useForm<CampusStep1FormValues>({
    resolver: zodResolver(campusStep1Schema),
    defaultValues,
    mode: "onSubmit",
  });

  const { control, register, handleSubmit, formState, watch, reset } = form;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    const subscription = watch((values) => {
      updateCampus({
        name: values.name ?? "",
        motto: values.motto ?? "",
        type: values.type ?? "",
        location: values.location ?? "",
      });
    });

    return () => subscription.unsubscribe();
  }, [updateCampus, watch]);

  const addNick = useCallback(() => {
    const val = nickRef.current?.value.trim();
    if (!val) return;

    if (campus.nicks.some((n) => n.toLowerCase() === val.toLowerCase())) {
      setNickError("Already added");
      return;
    }

    updateCampus({ nicks: [...campus.nicks, val] });
    if (nickRef.current) nickRef.current.value = "";
    setNickError("");
  }, [campus.nicks, updateCampus]);

  const rmNick = useCallback(
    (index: number) => {
      updateCampus({ nicks: campus.nicks.filter((_, idx) => idx !== index) });
    },
    [campus.nicks, updateCampus],
  );

  const onSubmit = handleSubmit((values) => {
    updateCampus({
      name: values.name.trim(),
      motto: values.motto,
      type: values.type,
      location: values.location,
    });
    goNext();
  });

  return {
    control,
    register,
    errors: formState.errors,
    nickError,
    nickRef,
    addNick,
    rmNick,
    nicks: campus.nicks,
    onSubmit,
    typeOptions: CAMPUS_TYPE_OPTIONS,
    locationOptions: CAMPUS_LOCATION_OPTIONS,
  };
}
