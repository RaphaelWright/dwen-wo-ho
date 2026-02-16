"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseImageEditorProps {
  photoPreview: string | null;
}

export const useImageEditor = ({ photoPreview }: UseImageEditorProps) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{
    posX: number;
    posY: number;
    clientX: number;
    clientY: number;
  }>({ posX: 0, posY: 0, clientX: 0, clientY: 0 });

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorImageRef = useRef<HTMLImageElement>(null);

  const handleEditorImageLoad = () => {
    const img = editorImageRef.current;
    if (img) {
      setImageSize({ w: img.naturalWidth, h: img.naturalHeight });
    }
  };

  const setFitToFrame = useCallback(() => {
    const container = editorContainerRef.current;
    const img = editorImageRef.current;
    if (!container || !img || !imageSize) return;
    const fw = container.clientWidth;
    const fh = container.clientHeight;
    const nw = imageSize.w;
    const nh = imageSize.h;
    const scaleFit = Math.min(fw / nw, fh / nh);
    setScale(scaleFit);
    setPosX(0);
    setPosY(0);
  }, [imageSize]);

  // Reset when photo changes
  useEffect(() => {
    if (photoPreview) {
      setScale(1);
      setRotation(0);
      setPosX(0);
      setPosY(0);
      setImageSize(null);
    }
  }, [photoPreview]);

  // Handle Dragging
  const handlePanStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      posX,
      posY,
      clientX: e.clientX,
      clientY: e.clientY,
    };
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const d = dragStartRef.current;
    setPosX(d.posX + e.clientX - d.clientX);
    setPosY(d.posY + e.clientY - d.clientY);
  };

  const handlePanEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const d = dragStartRef.current;
      setPosX(d.posX + e.clientX - d.clientX);
      setPosY(d.posY + e.clientY - d.clientY);
    };
    const onUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  const captureFrame = useCallback((): Promise<{
    file: File;
    dataUrl: string;
  }> => {
    return new Promise((resolve, reject) => {
      const container = editorContainerRef.current;
      const img = editorImageRef.current;
      if (!container || !img || !photoPreview) {
        reject(new Error("Editor not ready"));
        return;
      }
      const fw = container.clientWidth;
      const fh = container.clientHeight;
      const canvas = document.createElement("canvas");
      canvas.width = fw;
      canvas.height = fh;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context"));
        return;
      }
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      ctx.save();
      ctx.translate(fw / 2 + posX, fh / 2 + posY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.translate(-nw / 2, -nh / 2);
      ctx.drawImage(img, 0, 0, nw, nh);
      ctx.restore();
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Blob"));
            return;
          }
          const file = new File([blob], "cover.png", { type: "image/png" });
          const dataUrl = canvas.toDataURL("image/png");
          resolve({ file, dataUrl });
        },
        "image/png",
        0.95,
      );
    });
  }, [photoPreview, posX, posY, rotation, scale]);

  return {
    scale,
    setScale,
    rotation,
    setRotation,
    posX,
    setPosX,
    posY,
    setPosY,
    imageSize,
    isDragging,
    editorContainerRef,
    editorImageRef,
    handleEditorImageLoad,
    setFitToFrame,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    captureFrame,
    resetEditor: () => {
      setScale(1);
      setRotation(0);
      setPosX(0);
      setPosY(0);
      setImageSize(null);
    },
  };
};
