"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { getCroppedImg, Area } from "@/lib/utils/image-utils";

export const usePhotoStep = ({
  onChange,
  onNext,
}: {
  onChange: (field: "photo", value: string | null) => void;
  onNext: () => void;
}) => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPhotoMutation } = useAuthQuery();

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target?.result as string;
        setImageSrc(photoData);
        setIsPhotoModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setIsPhotoModalOpen(false);
    setSelectedFile(null);
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddPhoto = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      setIsPhotoModalOpen(false);
      return;
    }

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) {
        toast.error(SIGN_UP_TEXTS.photoStep.failedProcess);
        return;
      }

      // Convert Blob to File to ensure consistent handling by backend
      const file = new File([croppedBlob], "profile-photo.jpg", {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("image", file);

      try {
        // Send FormData to API
        await addPhotoMutation.mutateAsync(formData);

        // Create preview URL for display
        const previewUrl = URL.createObjectURL(croppedBlob);
        onChange("photo", previewUrl);

        toast.success(SIGN_UP_TEXTS.photoStep.successUpload);
        setIsPhotoModalOpen(false);
        // Automatically move to next step as per requirements
        onNext();
      } catch (error) {
        toast.error(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.message || SIGN_UP_TEXTS.photoStep.failedUpload,
        );
      }
    } catch {
      toast.error(SIGN_UP_TEXTS.photoStep.failedProcess);
    }
  };

  const handleFileClick = () => {
    if (imageSrc) {
      setIsPhotoModalOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return {
    isPhotoModalOpen,
    setIsPhotoModalOpen,
    imageSrc,
    fileInputRef,
    addPhotoMutation,
    onCropComplete,
    handlePhotoUpload,
    handleCancel,
    handleAddPhoto,
    handleFileClick,
    handleUploadClick,
  };
};
