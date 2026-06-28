"use client";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { m, AnimatePresence } from "motion/react";
import { RotateCcw } from "lucide-react";
import Cropper from "react-easy-crop";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { PhotoCropperOverlayProps } from "@/lib/types/components/shared/overlays";
import { cn } from "@/lib/utils";
import { usePhotoCropper } from "@/hooks/components/shared/overlays/use-photo-cropper";

export const PhotoCropperOverlay = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  onSave,
  onCancel,
  isSaving = false,
}: PhotoCropperOverlayProps) => {
  const { crop, setCrop, zoom, setZoom, handleReset } = usePhotoCropper();

  return (
    <AnimatePresence>
      {isOpen && imageSrc && (
        <>
          <m.div
            key="photo-cropper-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "bg-background/80 z-modal-stack fixed inset-0 backdrop-blur-3xl",
            )}
            onClick={onClose}
          />

          <m.div
            key="photo-cropper-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "z-modal-stack fixed inset-0 flex items-center justify-center p-3 sm:p-4",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card text-foreground border-border flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border shadow-2xl sm:rounded-2xl">
              {/* Header */}
              <div className="border-border bg-muted/30 border-b px-4 py-4 sm:px-8 sm:py-6">
                <h2 className="text-foreground text-lg font-bold sm:text-xl">
                  {SIGN_UP_TEXTS.photoStep.editPhoto}
                </h2>
                <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                  {SIGN_UP_TEXTS.photoStep.editPhotoDescription}
                </p>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-8">
                <div className="bg-muted relative h-56 w-full overflow-hidden sm:h-96">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="bg-muted accent-muted-foreground h-2 w-full flex-1 cursor-pointer appearance-none rounded-lg"
                    aria-label="Zoom"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleReset}
                    aria-label="Reset crop"
                  >
                    <RotateCcw className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="border-border bg-muted/30 flex justify-end gap-2 border-t px-4 py-4 sm:gap-3 sm:px-8 sm:py-6">
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="outline"
                  className="border-destructive text-destructive hover:border-destructive hover:bg-destructive h-9 px-4 text-sm hover:text-white sm:h-10 sm:px-6"
                  disabled={isSaving}
                >
                  {SIGN_UP_TEXTS.photoStep.cancel}
                </Button>
                <LoadingButton
                  type="button"
                  onClick={onSave}
                  loading={isSaving}
                  loadingText={SIGN_UP_TEXTS.photoStep.uploading}
                  className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 h-9 px-5 text-sm font-semibold shadow-lg disabled:opacity-50 disabled:shadow-none sm:h-10 sm:px-8 sm:text-base"
                >
                  {SIGN_UP_TEXTS.photoStep.add}
                </LoadingButton>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};
