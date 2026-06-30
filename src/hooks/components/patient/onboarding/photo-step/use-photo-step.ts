"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { getCroppedImg } from "@/lib/utils/shared/crop-image";
import type { Area } from "@/lib/types/components/shared/geometry";

export function usePatientPhotoStep({
  onPhotoChange,
}: {
  onPhotoChange: (url: string, file: File | null) => void;
}) {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const photoData = loadEvent.target?.result as string;
      const preload = new window.Image();
      preload.onload = () => {
        setImageSrc(photoData);
        setIsPhotoModalOpen(true);
      };
      preload.onerror = () => {
        toast.error("Could not load that image. Try another file.");
      };
      preload.src = photoData;
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setIsPhotoModalOpen(false);
    setImageSrc(null);
    setCroppedAreaPixels(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddPhoto = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      setIsPhotoModalOpen(false);
      return;
    }

    setIsSaving(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) {
        toast.error("Could not process your photo. Try another image.");
        return;
      }

      const file = new File([croppedBlob], "profile-photo.jpg", {
        type: "image/jpeg",
      });
      const previewUrl = URL.createObjectURL(croppedBlob);
      onPhotoChange(previewUrl, file);
      setIsPhotoModalOpen(false);
    } catch {
      toast.error("Could not process your photo. Try another image.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileClick = () => {
    if (imageSrc) {
      setIsPhotoModalOpen(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return {
    isPhotoModalOpen,
    setIsPhotoModalOpen,
    imageSrc,
    fileInputRef,
    isSaving,
    onCropComplete,
    handlePhotoUpload,
    handleCancel,
    handleAddPhoto,
    handleFileClick,
    handleUploadClick,
  };
}
