"use client";

import { ArrowBigLeftIcon } from "lucide-react";
import { AddCoverPageWizardProps } from "@/lib/types/components/shared/overlays";
import { useAddCoverPage } from "@/hooks/components/curator/content-pages/use-add-cover-page";
import { PhotoColorStep } from "./photo-color-step";
import { EditImageStep } from "./edit-image-step";
import { SloganStep } from "./slogan-step";

export default function AddCoverPageWizard(props: AddCoverPageWizardProps) {
  const {
    step,
    photoPreview,
    selectedColor,
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
    handleBack,
    headerTitle,
    headerAction,
  } = useAddCoverPage(props);

  if (!props.isOpen) return null;

  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl">
      <div className="bg-card text-foreground border-border flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border shadow-2xl">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b p-6">
          <button
            type="button"
            onClick={handleBack}
            className="bg-muted hover:bg-muted-foreground/40 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
          >
            <ArrowBigLeftIcon className="h-6 w-6" />
          </button>
          <h2 className="text-foreground text-2xl font-bold">{headerTitle}</h2>
          <button
            type="button"
            onClick={headerAction.onClick}
            disabled={headerAction.disabled}
            className={`rounded-lg px-6 py-2 font-semibold transition-colors ${
              headerAction.disabled
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {headerAction.label}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "photo-color" && (
            <PhotoColorStep
              photoPreview={photoPreview}
              fileInputRef={fileInputRef}
              handlePhotoSelect={handlePhotoSelect}
              colorDropdownRef={colorDropdownRef}
              showColorDropdown={showColorDropdown}
              setShowColorDropdown={setShowColorDropdown}
              selectedColor={selectedColor}
              handleColorSelect={handleColorSelect}
            />
          )}

          {step === "edit-image" && photoPreview && (
            <EditImageStep
              photoPreview={photoPreview}
              editorContainerRef={editorContainerRef}
              editorImageRef={editorImageRef}
              handleEditorImageLoad={handleEditorImageLoad}
              isDragging={isDragging}
              handlePanStart={handlePanStart}
              handlePanMove={handlePanMove}
              handlePanEnd={handlePanEnd}
              scale={scale}
              setScale={setScale}
              rotation={rotation}
              setRotation={setRotation}
              posX={posX}
              posY={posY}
              setFitToFrame={setFitToFrame}
            />
          )}

          {step === "slogan" && (
            <SloganStep
              slogan={slogan}
              setSlogan={setSlogan}
              selectedColor={selectedColor}
              photoPreview={photoPreview}
            />
          )}
        </div>
      </div>
    </div>
  );
}
