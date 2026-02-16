"use client";

import Image from "next/image";
import {
  ChevronDown,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Maximize2,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border-2 border-[#955aa4]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <button
            onClick={handleBack}
            className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <Image
              src="/arrow-diagonal-white.svg"
              alt="Back"
              width={20}
              height={20}
              className="rotate-180"
            />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{headerTitle}</h2>
          <button
            onClick={headerAction.onClick}
            disabled={headerAction.disabled}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              headerAction.disabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
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
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Photo
                  </label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-base"
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
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Colors
                  </label>
                  <button
                    onClick={() => setShowColorDropdown(!showColorDropdown)}
                    className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-between text-base"
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
                    <div className="absolute z-10 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                        {COVER_PAGE_COLORS.map((color) => (
                          <button
                            key={color.hex}
                            onClick={() => handleColorSelect(color)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                          >
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-gray-200 shrink-0"
                              style={{ backgroundColor: `#${color.hex}` }}
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {color.name}
                              </p>
                              <p className="text-sm text-gray-500">
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
              <div className="border-b border-gray-200" />
              <div>
                <div
                  className="w-full h-64 rounded-xl border-2 border-gray-200 overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundColor: selectedColor
                      ? `#${selectedColor}`
                      : "#f9fafb",
                  }}
                >
                  {photoPreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={photoPreview}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center">
                      Add photo to get started
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === "edit-image" && photoPreview && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Zoom, rotate, or drag the image to set the focus. The rectangle
                is what will show on the cover.
              </p>
              {/* Frame: fixed aspect, overflow hidden */}
              <div
                ref={editorContainerRef}
                className="relative w-full rounded-xl border-2 border-gray-300 overflow-hidden bg-gray-100 select-none"
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
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                  title="Zoom out"
                >
                  <ZoomOut className="w-5 h-5 text-gray-700" />
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
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                  title="Zoom in"
                >
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r - 90) % 360)}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                  title="Rotate left"
                >
                  <RotateCcw className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                  title="Rotate right"
                >
                  <RotateCw className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={setFitToFrame}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center gap-1"
                  title="Fit to frame"
                >
                  <Maximize2 className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium">Fit</span>
                </button>
              </div>
            </div>
          )}

          {step === "slogan" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Slogan
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Enter slogan..."
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <div
                  className="w-full h-75 rounded-xl border-2 border-gray-200 overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundColor: selectedColor
                      ? `#${selectedColor}`
                      : "#f9fafb",
                  }}
                >
                  {photoPreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={photoPreview}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center">
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
