"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import {
  activeSchoolAtom,
  activeStatusAtom,
  searchQueryAtom,
  notifOpenAtom,
  profileOpenAtom,
  editOpenAtom,
  profileDataAtom,
  notificationsAtom,
  editFieldKeyAtom,
  editFieldLabelAtom,
  editValueAtom,
} from "@/atoms/new-provider";
import {
  NEW_PROVIDER_PATIENTS,
  NEW_PROVIDER_SCHOOLS,
} from "@/data/mock-provider-data";

export default function useNewProvider() {
  /* ── Filter state ─────────────────────────────────── */
  const [activeSchool, setActiveSchool] = useAtom(activeSchoolAtom);
  const [activeStatus, setActiveStatus] = useAtom(activeStatusAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

  /* ── Modal / sheet open state ─────────────────────── */
  const [notifOpen, setNotifOpen] = useAtom(notifOpenAtom);
  const [profileOpen, setProfileOpen] = useAtom(profileOpenAtom);
  const [editOpen, setEditOpen] = useAtom(editOpenAtom);

  /* ── Profile data ─────────────────────────────────── */
  const [profileData, setProfileData] = useAtom(profileDataAtom);

  /* ── Notifications ────────────────────────────────── */
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const unreadCount = notifications.filter((n: any) => n.unread).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev: any[]) =>
      prev.map((n) => ({ ...n, unread: false })),
    );
  }, [setNotifications]);

  const markOneRead = useCallback(
    (id: number) => {
      setNotifications((prev: any[]) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
      );
    },
    [setNotifications],
  );

  /* ── Edit-field dialog state ──────────────────────── */
  const [editFieldKey, setEditFieldKey] = useAtom(editFieldKeyAtom);
  const [editFieldLabel, setEditFieldLabel] = useAtom(editFieldLabelAtom);
  const [editValue, setEditValue] = useAtom(editValueAtom);

  /** Open the edit dialog for a given profile field */
  const openEdit = useCallback(
    (key: any, label: any, current: any) => {
      setEditFieldKey(key);
      setEditFieldLabel(label);
      setEditValue(current);
      setEditOpen(true);
    },
    [setEditFieldKey, setEditFieldLabel, setEditValue, setEditOpen],
  );

  /** Commit the edited value back to profileData */
  const saveEdit = useCallback(() => {
    if (editFieldKey && editValue.trim()) {
      setProfileData((prev) => ({
        ...prev,
        [editFieldKey as string]: editValue.trim(),
      }));
    }
    setEditOpen(false);
  }, [editFieldKey, editValue, setProfileData, setEditOpen]);

  /* ── School filter helpers ────────────────────────── */
  const handleSelectSchool = (id: any) => {
    setActiveSchool(id);
    // Reset status chip when switching school so counts feel fresh
    setActiveStatus("all");
  };

  const handleClearSchool = () => {
    setActiveSchool("all");
    setActiveStatus("all");
  };

  /* ── Derived filtered list ── */
  const filteredPatients = NEW_PROVIDER_PATIENTS.filter((p) => {
    const schoolMatch = activeSchool === "all" || p.school === activeSchool;
    const statusMatch = activeStatus === "all" || p.status === activeStatus;
    const searchMatch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.schoolLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return schoolMatch && statusMatch && searchMatch;
  });

  const schoolLabel =
    NEW_PROVIDER_SCHOOLS.find((s) => s.id === activeSchool)?.label ?? "";

  /* Count per status chip after school + search filter (ignoring status) */
  const countForChip = (chipId: string) =>
    NEW_PROVIDER_PATIENTS.filter((p) => {
      const schoolMatch = activeSchool === "all" || p.school === activeSchool;
      const searchMatch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.schoolLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.preview.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = chipId === "all" || p.status === chipId;
      return schoolMatch && searchMatch && statusMatch;
    }).length;

  return {
    activeSchool,
    setActiveSchool,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    notifOpen,
    setNotifOpen,
    profileOpen,
    setProfileOpen,
    editOpen,
    setEditOpen,
    profileData,
    setProfileData,
    notifications,
    setNotifications,
    unreadCount,
    markAllRead,
    markOneRead,
    editFieldKey,
    setEditFieldKey,
    editFieldLabel,
    setEditFieldLabel,
    editValue,
    setEditValue,
    openEdit,
    saveEdit,
    handleSelectSchool,
    handleClearSchool,
    filteredPatients,
    countForChip,
    schoolLabel,
  };
}
