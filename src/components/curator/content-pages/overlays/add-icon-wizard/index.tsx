"use client";

import { AddIconWizardProps } from "@/lib/types/components/shared/overlays";
import { ArrowBigLeftIcon } from "lucide-react";
import { useIconForm } from "@/hooks/components/curator/content-pages/use-icon-form";
import { Button } from "@/components/ui/button";
import { IconPreviewPanel } from "./icon-preview-panel";
import { IconFormFields } from "./icon-form-fields";

export default function AddIconWizard({
  isOpen,
  onClose,
  onComplete,
  editData = null,
  selectedSchool,
}: AddIconWizardProps) {
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
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-card text-foreground border-border flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b p-6">
          <Button
            onClick={onClose}
            className="bg-muted hover:bg-muted-foreground/40 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
          >
            <ArrowBigLeftIcon />
          </Button>
          <h2 className="text-foreground text-2xl font-bold">{headerTitle}</h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content - Two Column Layout */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex h-full flex-col gap-6 lg:flex-row">
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
            <div className="bg-border hidden w-px shrink-0 lg:block"></div>

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

        <div className="border-border bg-muted/20 flex items-center justify-end border-t p-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`h-auto rounded-lg px-8 py-3 font-semibold transition-colors ${
              isSubmitDisabled
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 shadow-md"
            }`}
          >
            GO
          </Button>
        </div>
      </div>
    </div>
  );
}
