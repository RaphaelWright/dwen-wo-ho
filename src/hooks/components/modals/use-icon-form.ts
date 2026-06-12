"use client";

import { useState, useRef } from "react";
import { AddIconModalProps } from "@/lib/types/modals";

export const useIconForm = ({
  editData,
  onComplete,
  isOpen,
  selectedSchool,
}: {
  editData: AddIconModalProps["editData"];
  onComplete: AddIconModalProps["onComplete"];
  isOpen: boolean;
  selectedSchool: AddIconModalProps["selectedSchool"];
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [rank, setRank] = useState(1);
  const [lockIns, setLockIns] = useState<{ id: string; value: string }[]>([]);
  const [newLockInInput, setNewLockInInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Seed/reset the form while rendering when the modal opens or the edited
  // record changes, instead of mirroring props into state via an effect.
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevEditData, setPrevEditData] = useState(editData);
  if (isOpen !== prevIsOpen || editData !== prevEditData) {
    setPrevIsOpen(isOpen);
    setPrevEditData(editData);
    if (isOpen && editData) {
      setPhotoPreview(editData.photoPreview);
      setName(editData.name);
      setSlogan(editData.slogan);
      setRank(editData.rank);
      setLockIns(
        (editData.lockIns || []).map((value) => ({
          id: crypto.randomUUID(),
          value,
        })),
      );
    } else if (isOpen && !editData) {
      // Reset for new icon
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setName("");
      setSlogan("");
      setRank(1);
      setLockIns([]);
      setNewLockInInput("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  const handleAddLockIn = () => {
    if (newLockInInput.trim()) {
      setLockIns([
        ...lockIns,
        { id: crypto.randomUUID(), value: newLockInInput.trim() },
      ]);
      setNewLockInInput("");
    }
  };

  const handleUpdateLockIn = (id: string, value: string) => {
    setLockIns(
      lockIns.map((lockIn) =>
        lockIn.id === id ? { ...lockIn, value } : lockIn,
      ),
    );
  };

  const handleRemoveLockIn = (id: string) => {
    setLockIns(lockIns.filter((lockIn) => lockIn.id !== id));
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (name.trim() && slogan.trim()) {
      onComplete({
        photo: selectedPhoto,
        name: name.trim(),
        slogan: slogan.trim(),
        rank,
        lockIns: lockIns.flatMap((lockIn) =>
          lockIn.value.trim() !== "" ? [lockIn.value] : [],
        ),
      });
      // Reset state
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setName("");
      setSlogan("");
      setRank(1);
      setLockIns([]);
      setNewLockInInput("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const firstCampus =
    selectedSchool?.campuses &&
    Array.isArray(selectedSchool.campuses) &&
    selectedSchool.campuses.length > 0
      ? selectedSchool.campuses[0]
      : "";

  const headerTitle = editData ? "Edit Icon" : "New Icons";
  const isSubmitDisabled = !name.trim() || !slogan.trim();

  return {
    selectedPhoto,
    photoPreview,
    name,
    setName,
    slogan,
    setSlogan,
    rank,
    setRank,
    lockIns,
    newLockInInput,
    setNewLockInInput,
    fileInputRef,
    handleAddLockIn,
    handleUpdateLockIn,
    handleRemoveLockIn,
    handlePhotoSelect,
    handleSubmit,
    firstCampus,
    headerTitle,
    isSubmitDisabled,
  };
};
