"use client";

import { useState, useRef, useEffect } from "react";
import {
  AddCoverPageModalProps,
  ColorOption,
  CoverPageStep,
} from "@/lib/types/modals";
import { useImageEditor } from "@/hooks/components/modals/use-image-editor";

export const useAddCoverPage = ({
  isOpen,
  onClose,
  onComplete,
  editData,
}: AddCoverPageModalProps) => {
  const [step, setStep] = useState<CoverPageStep>("photo-color");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [slogan, setSlogan] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  const {
    scale,
    setScale,
    setRotation,
    rotation,
    posX,
    posY,
    isDragging,
    editorContainerRef,
    editorImageRef,
    handleEditorImageLoad,
    setFitToFrame,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    captureFrame,
    resetEditor,
    imageSize,
  } = useImageEditor({ photoPreview });

  useEffect(() => {
    if (isOpen && editData) {
      setPhotoPreview(editData.photoPreview);
      setSelectedColor(editData.color);
      setSlogan(editData.slogan);
      setStep("slogan");
    } else if (isOpen && !editData) {
      setStep("photo-color");
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setSelectedColor("");
      setSlogan("");
      resetEditor();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen, editData, resetEditor]);

  useEffect(() => {
    if (step === "edit-image" && imageSize) {
      setFitToFrame();
    }
  }, [step, imageSize, setFitToFrame]);

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

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color.hex);
    setShowColorDropdown(false);
  };

  const handleGoFromPhotoColor = () => {
    if (selectedPhoto && selectedColor) {
      setStep("edit-image");
    }
  };

  const handleApplyEditor = async () => {
    try {
      const { file, dataUrl } = await captureFrame();
      setSelectedPhoto(file);
      setPhotoPreview(dataUrl);
      setStep("slogan");
    } catch {
      setStep("slogan");
    }
  };

  const handleBack = () => {
    if (step === "slogan") {
      setStep("edit-image");
    } else if (step === "edit-image") {
      setStep("photo-color");
    } else {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (slogan.trim()) {
      onComplete({
        photo: selectedPhoto,
        color: selectedColor,
        slogan: slogan.trim(),
      });
      setStep("photo-color");
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setSelectedColor("");
      setSlogan("");
      resetEditor();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Close color dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(event.target as Node)
      ) {
        setShowColorDropdown(false);
      }
    };
    if (showColorDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showColorDropdown]);

  const headerTitle = editData
    ? "Edit Cover Page"
    : step === "photo-color"
      ? "Add Cover Page"
      : step === "edit-image"
        ? "Position your photo"
        : "Slogan";

  const getHeaderAction = () => {
    if (step === "photo-color") {
      return {
        label: "GO",
        onClick: handleGoFromPhotoColor,
        disabled: !photoPreview || !selectedColor,
      };
    }
    if (step === "edit-image") {
      return {
        label: "Apply",
        onClick: handleApplyEditor,
        disabled: false,
      };
    }
    return {
      label: "GO",
      onClick: handleSubmit,
      disabled: !slogan.trim(),
    };
  };

  const headerAction = getHeaderAction();

  return {
    step,
    setStep,
    selectedPhoto,
    photoPreview,
    selectedColor,
    setSelectedColor,
    showColorDropdown,
    setShowColorDropdown,
    slogan,
    setSlogan,
    fileInputRef,
    colorDropdownRef,
    scale,
    setScale,
    setRotation,
    rotation,
    posX,
    posY,
    isDragging,
    editorContainerRef,
    editorImageRef,
    handleEditorImageLoad,
    setFitToFrame,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    handlePhotoSelect,
    handleColorSelect,
    handleGoFromPhotoColor,
    handleApplyEditor,
    handleSubmit,
    handleBack,
    headerTitle,
    headerAction,
  };
};
