"use client";

import Image from "next/image";
import {
  ChevronDown,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Maximize2,
  ArrowBigLeftIcon,
} from "lucide-react";
import { AddCoverPageModalProps } from "@/lib/types/modals";
import {
  COVER_PAGE_COLORS,
  COVER_PAGE_CONSTANTS,
} from "@/lib/constants/components/modals/add-cover-page";
import { useAddCoverPage } from "@/hooks/components/modals/use-add-cover-page";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background backdrop-blur-sm">
      <div className="bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <button
            onClick={handleBack}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted-foreground/40 transition-colors"
          >
            <ArrowBigLeftIcon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-foreground">{headerTitle}</h2>
          <button
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
            <div className="space-y-6">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Photo
                  </label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-base"
                  >
                    + Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>
                <div className="relative flex-1" ref={colorDropdownRef}>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Colors
                  </label>
                  <button
                    onClick={() => setShowColorDropdown(!showColorDropdown)}
                    className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-between text-base"
                  >
                    <span>
                      {selectedColor
                        ? COVER_PAGE_COLORS.find((c) => c.hex === selectedColor)
                            ?.name || `#${selectedColor}`
                        : "Colors"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        showColorDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showColorDropdown && (
                    <div className="absolute z-10 mt-2 w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                        {COVER_PAGE_COLORS.map((color) => (
                          <button
                            key={color.hex}
                            onClick={() => handleColorSelect(color)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors text-left"
                          >
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-border shrink-0"
                              style={{ backgroundColor: `#${color.hex}` }}
                            />
                            <div>
                              <p className="font-semibold text-foreground">
                                {color.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                #{color.hex}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-b border-border" />
              <div>
                <div
                  className="w-full h-64 rounded-xl border-2 border-border overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundColor: selectedColor
                      ? `#${selectedColor}`
                      : "var(--muted)",
                  }}
                >
                  {photoPreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={photoPreview}
                        alt="Cover preview"
                        width={400}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center">
                      Add photo to get started
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === "edit-image" && photoPreview && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Zoom, rotate, or drag the image to set the focus. The rectangle
                is what will show on the cover.
              </p>
              {/* Frame: fixed aspect, overflow hidden */}
              <div
                ref={editorContainerRef}
                className="relative w-full rounded-xl border-2 border-border overflow-hidden bg-muted select-none"
                style={{
                  aspectRatio: COVER_PAGE_CONSTANTS.EDIT_FRAME_ASPECT,
                  maxHeight: 360,
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                onMouseDown={handlePanStart}
                onMouseMove={handlePanMove}
                onMouseLeave={handlePanEnd}
                onMouseUp={handlePanEnd}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="relative"
                    style={{
                      transform: `translate(${posX}px, ${posY}px)`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={editorImageRef}
                      src={photoPreview}
                      alt="Edit"
                      onLoad={handleEditorImageLoad}
                      className="block max-w-none"
                      style={{
                        transform: `scale(${scale}) rotate(${rotation}deg)`,
                        transformOrigin: "center center",
                      }}
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
              {/* Controls */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setScale((s) =>
                      Math.max(
                        COVER_PAGE_CONSTANTS.MIN_SCALE,
                        s - COVER_PAGE_CONSTANTS.SCALE_STEP,
                      ),
                    )
                  }
                  className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut className="w-5 h-5 text-foreground" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setScale((s) =>
                      Math.min(
                        COVER_PAGE_CONSTANTS.MAX_SCALE,
                        s + COVER_PAGE_CONSTANTS.SCALE_STEP,
                      ),
                    )
                  }
                  className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn className="w-5 h-5 text-foreground" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r - 90) % 360)}
                  className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                  title="Rotate left"
                >
                  <RotateCcw className="w-5 h-5 text-foreground" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                  title="Rotate right"
                >
                  <RotateCw className="w-5 h-5 text-foreground" />
                </button>
                <button
                  type="button"
                  onClick={setFitToFrame}
                  className="p-2 rounded-lg border border-border hover:bg-muted flex items-center gap-1 transition-colors"
                  title="Fit to frame"
                >
                  <Maximize2 className="w-5 h-5 text-foreground" />
                  <span className="text-sm font-medium">Fit</span>
                </button>
              </div>
            </div>
          )}

          {step === "slogan" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Slogan
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Enter slogan..."
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <div
                  className="w-full h-75 rounded-xl border-2 border-border overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundColor: selectedColor
                      ? `#${selectedColor}`
                      : "var(--muted)",
                  }}
                >
                  {photoPreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={photoPreview}
                        alt="Cover preview"
                        width={400}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center">
                      Preview will appear here
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
