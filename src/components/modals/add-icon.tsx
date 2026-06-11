"use client";

import { AddIconModalProps } from "@/lib/types/modals";
import { ArrowBigLeftIcon } from "lucide-react";
import { useIconForm } from "@/hooks/components/modals/use-icon-form";
import { Button } from "../ui/button";
import { IconPreviewPanel } from "./add-icon/icon-preview-panel";
import { IconFormFields } from "./add-icon/icon-form-fields";

export default function AddIconModal({
  isOpen,
  onClose,
  onComplete,
  editData = null,
  selectedSchool,
}: AddIconModalProps) {
  const {
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
  } = useIconForm({ editData, onComplete, isOpen, selectedSchool });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background backdrop-blur-sm">
      <div className="bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <Button
            onClick={onClose}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted-foreground/40 transition-colors"
          >
           <ArrowBigLeftIcon/>
          </Button>
          <h2 className="text-2xl font-bold text-foreground">{headerTitle}</h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content - Two Column Layout */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Left Side - Preview */}
            <IconPreviewPanel
              photoPreview={photoPreview}
              name={name}
              slogan={slogan}
              rank={rank}
              fileInputRef={fileInputRef}
              handlePhotoSelect={handlePhotoSelect}
              selectedSchool={selectedSchool}
              firstCampus={firstCampus}
              lockIns={lockIns}
              newLockInInput={newLockInInput}
              setNewLockInInput={setNewLockInInput}
              handleAddLockIn={handleAddLockIn}
              handleUpdateLockIn={handleUpdateLockIn}
              handleRemoveLockIn={handleRemoveLockIn}
            />

            {/* Separator Line */}
            <div className="hidden lg:block w-px bg-border shrink-0"></div>

            {/* Right Side - Form */}
            <IconFormFields
              name={name}
              setName={setName}
              slogan={slogan}
              setSlogan={setSlogan}
              rank={rank}
              setRank={setRank}
              fileInputRef={fileInputRef}
              handlePhotoSelect={handlePhotoSelect}
            />
          </div>
        </div>

        <div className="flex items-center justify-end p-6 border-t border-border bg-muted/20">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors h-auto ${
              isSubmitDisabled
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
            }`}
          >
            GO
          </Button>
        </div>
      </div>
    </div>
  );
}
