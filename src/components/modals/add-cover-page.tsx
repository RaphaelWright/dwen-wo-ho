"use client";

import { ArrowBigLeftIcon } from "lucide-react";
import { AddCoverPageModalProps } from "@/lib/types/modals";
import { useAddCoverPage } from "@/hooks/components/modals/use-add-cover-page";
import { PhotoColorStep } from "./add-cover-page/photo-color-step";
import { EditImageStep } from "./add-cover-page/edit-image-step";
import { SloganStep } from "./add-cover-page/slogan-step";

export default function AddCoverPageModal(props: AddCoverPageModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background backdrop-blur-3xl">
      <div className="bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted-foreground/40 transition-colors"
          >
            <ArrowBigLeftIcon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-foreground">{headerTitle}</h2>
          <button
            type="button"
            onClick={headerAction.onClick}
            disabled={headerAction.disabled}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
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
