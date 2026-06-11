"use client";

import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Maximize2 } from "lucide-react";
import { COVER_PAGE_CONSTANTS } from "@/lib/constants/components/modals/add-cover-page";
import { CoverEditImageStepProps } from "@/lib/types/components/modals/add-cover-page";

export function EditImageStep({
  photoPreview,
  editorContainerRef,
  editorImageRef,
  handleEditorImageLoad,
  isDragging,
  handlePanStart,
  handlePanMove,
  handlePanEnd,
  scale,
  setScale,
  rotation,
  setRotation,
  posX,
  posY,
  setFitToFrame,
}: CoverEditImageStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Zoom, rotate, or drag the image to set the focus. The rectangle is what
        will show on the cover.
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
  );
}
