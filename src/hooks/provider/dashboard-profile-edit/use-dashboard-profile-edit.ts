"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import {
  editOpenAtom,
  editFieldKeyAtom,
  editFieldLabelAtom,
  editValueAtom,
  profileDataAtom,
} from "@/atoms/new-provider";
import {
  useUpdateProfileMutation,
  useUpdatePhoneNumberMutation,
} from "@/hooks/queries/use-provider-dashboard";
import { persistProviderProfileEdit } from "@/lib/utils/provider/profile-edit";

export function useProviderDashboardProfileEdit() {
  const [profileData, setProfileData] = useAtom(profileDataAtom);
  const [editOpen, setEditOpen] = useAtom(editOpenAtom);
  const [editFieldKey, setEditFieldKey] = useAtom(editFieldKeyAtom);
  const [editFieldLabel, setEditFieldLabel] = useAtom(editFieldLabelAtom);
  const [editValue, setEditValue] = useAtom(editValueAtom);

  const updateProfileMutation = useUpdateProfileMutation();
  const updatePhoneNumberMutation = useUpdatePhoneNumberMutation();

  const openEdit = useCallback(
    (key: string, label: string, current: string) => {
      setEditFieldKey(key);
      setEditFieldLabel(label);
      setEditValue(current);
      setEditOpen(true);
    },
    [setEditFieldKey, setEditFieldLabel, setEditValue, setEditOpen],
  );

  const saveEdit = useCallback(async () => {
    if (editFieldKey === "photo") {
      setEditOpen(false);
      return;
    }

    const persisted = await persistProviderProfileEdit({
      editFieldKey,
      editValue,
      profileStatus: profileData?.status ?? "",
      updateProfile: updateProfileMutation.mutateAsync,
      updatePhoneNumber: updatePhoneNumberMutation.mutateAsync,
    });

    if (persisted && editFieldKey) {
      setProfileData((prev) => ({
        ...prev,
        [editFieldKey]: persisted,
      }));
    }

    setEditOpen(false);
  }, [
    editFieldKey,
    editValue,
    updateProfileMutation,
    updatePhoneNumberMutation,
    profileData?.status,
    setProfileData,
    setEditOpen,
  ]);

  return {
    profileData,
    setProfileData,
    editOpen,
    setEditOpen,
    editFieldKey,
    setEditFieldKey,
    editFieldLabel,
    setEditFieldLabel,
    editValue,
    setEditValue,
    openEdit,
    saveEdit,
    isSaving: updateProfileMutation.isPending,
    isUpdatingPhoneNumber: updatePhoneNumberMutation.isPending,
    updatePhoneNumber: updatePhoneNumberMutation.mutateAsync,
  };
}
