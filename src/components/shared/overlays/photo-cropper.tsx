"use client";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { m, AnimatePresence } from "motion/react";
import { RotateCcw } from "lucide-react";
import Cropper from "react-easy-crop";
import { ModalPortal } from "@/components/shared/overlays/modal-portal";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { PhotoCropperOverlayProps } from "@/lib/types/components/shared/overlays";
import { usePhotoCropper } from "@/hooks/components/shared/overlays/use-photo-cropper";
import {
  OVERLAY_BACKDROP_TRANSITION,
  OVERLAY_PANEL_ANIMATE,
  OVERLAY_PANEL_EXIT,
  OVERLAY_PANEL_INITIAL,
  OVERLAY_PANEL_TRANSITION,
} from "@/lib/utils/shared/overlay-motion";

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
    <ModalPortal>
      <AnimatePresence>
        {isOpen && imageSrc ? (
          <m.div
            key="photo-cropper-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_BACKDROP_TRANSITION}
            className="z-modal-stack fixed inset-0 flex items-center justify-center bg-black/50 p-3 sm:p-4"
            onClick={onClose}
          >
            <m.div
              initial={OVERLAY_PANEL_INITIAL}
              animate={OVERLAY_PANEL_ANIMATE}
              exit={OVERLAY_PANEL_EXIT}
              transition={OVERLAY_PANEL_TRANSITION}
              className="relative w-full max-w-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="bg-card text-foreground border-border flex w-full flex-col overflow-hidden rounded-xl border shadow-2xl sm:rounded-2xl">
                <div className="border-border bg-muted/30 border-b px-4 py-3 sm:px-6 sm:py-4">
                  <h2 className="text-foreground text-base font-bold sm:text-lg">
                    {SIGN_UP_TEXTS.photoStep.editPhoto}
                  </h2>
                  <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                    {SIGN_UP_TEXTS.photoStep.editPhotoDescription}
                  </p>
                </div>

                <div className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-6">
                  <div className="bg-muted relative h-48 w-full shrink-0 overflow-hidden sm:h-72">
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
                      onChange={(event) => setZoom(Number(event.target.value))}
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

                <div className="border-border bg-muted/30 flex justify-end gap-2 border-t px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
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
          </m.div>
        ) : null}
      </AnimatePresence>
    </ModalPortal>
  );
};
