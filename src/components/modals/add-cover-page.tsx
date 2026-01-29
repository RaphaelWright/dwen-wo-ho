"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronDown, ZoomIn, ZoomOut, RotateCcw, RotateCw, Maximize2 } from "lucide-react";

interface AddCoverPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { photo: File | null; color: string; slogan: string }) => void;
  editData?: {
    photoPreview: string;
    color: string;
    slogan: string;
  } | null;
}

interface ColorOption {
  hex: string;
  name: string;
}

const colors: ColorOption[] = [
  { hex: "faf5f9", name: "Soft Lavender" },
  { hex: "ecf1f9", name: "Light Blue" },
  { hex: "f6f9e6", name: "Pale Green" },
  { hex: "fcf1e9", name: "Peach" },
  { hex: "2b3990", name: "Deep Blue" },
  { hex: "ed1c24", name: "Red" },
  { hex: "955aa4", name: "Purple" },
  { hex: "2bb673", name: "Green" },
];

type Step = "photo-color" | "edit-image" | "slogan";

const EDIT_FRAME_ASPECT = 16 / 9;
const MIN_SCALE = 0.2;
const MAX_SCALE = 3;
const SCALE_STEP = 0.15;

export default function AddCoverPageModal({
  isOpen,
  onClose,
  onComplete,
  editData = null,
}: AddCoverPageModalProps) {
  const [step, setStep] = useState<Step>("photo-color");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [slogan, setSlogan] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  // Image editor state
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ posX: number; posY: number; clientX: number; clientY: number }>({ posX: 0, posY: 0, clientX: 0, clientY: 0 });
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorImageRef = useRef<HTMLImageElement>(null);

  // Load edit data when modal opens
  useEffect(() => {
    if (isOpen && editData) {
      setPhotoPreview(editData.photoPreview);
      setSelectedColor(editData.color);
      setSlogan(editData.slogan);
      setStep("slogan");
    } else if (isOpen && !editData) {
      setStep("photo-color");
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setSelectedColor("");
      setSlogan("");
      setScale(1);
      setRotation(0);
      setPosX(0);
      setPosY(0);
      setImageSize(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen, editData]);

  // When entering edit-image, reset transform and will set "fit" when image loads
  useEffect(() => {
    if (step === "edit-image" && photoPreview) {
      setScale(1);
      setRotation(0);
      setPosX(0);
      setPosY(0);
      setImageSize(null);
    }
  }, [step, photoPreview]);

  // Close color dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(event.target as Node)
      ) {
        setShowColorDropdown(false);
      }
    };
    if (showColorDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showColorDropdown]);

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color.hex);
    setShowColorDropdown(false);
  };

  const handleGoFromPhotoColor = () => {
    if (selectedPhoto && selectedColor) {
      setStep("edit-image");
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

  useEffect(() => {
    if (step !== "edit-image" || !imageSize || !editorContainerRef.current) return;
    setFitToFrame();
  }, [step, imageSize, setFitToFrame]);

  const handleEditorImageLoad = () => {
    const img = editorImageRef.current;
    if (img) {
      setImageSize({ w: img.naturalWidth, h: img.naturalHeight });
    }
  };

  const handlePanStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { posX, posY, clientX: e.clientX, clientY: e.clientY };
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

  const captureFrame = useCallback((): Promise<{ file: File; dataUrl: string }> => {
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
        0.95
      );
    });
  }, [photoPreview, posX, posY, rotation, scale]);

  const handleApplyEditor = async () => {
    try {
      const { file, dataUrl } = await captureFrame();
      setSelectedPhoto(file);
      setPhotoPreview(dataUrl);
      setStep("slogan");
    } catch {
      setStep("slogan");
    }
  };

  const handleGoToSlogan = () => {
    if (selectedPhoto && selectedColor) {
      if (step === "photo-color") {
        setStep("edit-image");
      }
    }
  };

  const handleSubmit = () => {
    if (slogan.trim()) {
      onComplete({
        photo: selectedPhoto,
        color: selectedColor,
        slogan: slogan.trim(),
      });
      setStep("photo-color");
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setSelectedColor("");
      setSlogan("");
      setScale(1);
      setRotation(0);
      setPosX(0);
      setPosY(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleBack = () => {
    if (step === "slogan") {
      setStep("edit-image");
    } else if (step === "edit-image") {
      setStep("photo-color");
    } else {
      onClose();
    }
  };

  const getHeaderTitle = () => {
    if (editData) return "Edit Cover Page";
    if (step === "photo-color") return "Add Cover Page";
    if (step === "edit-image") return "Position your photo";
    return "Slogan";
  };

  const getHeaderAction = () => {
    if (step === "photo-color") {
      return {
        label: "GO",
        onClick: handleGoFromPhotoColor,
        disabled: !selectedPhoto || !selectedColor,
      };
    }
    if (step === "edit-image") {
      return {
        label: "Apply",
        onClick: handleApplyEditor,
        disabled: false,
      };
    }
    return {
      label: "GO",
      onClick: handleSubmit,
      disabled: !slogan.trim(),
    };
  };

  if (!isOpen) return null;

  const headerAction = getHeaderAction();

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
          <h2 className="text-2xl font-bold text-gray-900">{getHeaderTitle()}</h2>
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
                        ? colors.find((c) => c.hex === selectedColor)?.name ||
                          `#${selectedColor}`
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
                        {colors.map((color) => (
                          <button
                            key={color.hex}
                            onClick={() => handleColorSelect(color)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                          >
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-gray-200 flex-shrink-0"
                              style={{ backgroundColor: `#${color.hex}` }}
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{color.name}</p>
                              <p className="text-sm text-gray-500">#{color.hex}</p>
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
                    backgroundColor: selectedColor ? `#${selectedColor}` : "#f9fafb",
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
                    <p className="text-gray-400 text-center">Add photo to get started</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === "edit-image" && photoPreview && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Zoom, rotate, or drag the image to set the focus. The rectangle is what will
                show on the cover.
              </p>
              {/* Frame: fixed aspect, overflow hidden */}
              <div
                ref={editorContainerRef}
                className="relative w-full rounded-xl border-2 border-gray-300 overflow-hidden bg-gray-100 select-none"
                style={{
                  aspectRatio: EDIT_FRAME_ASPECT,
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
                  onClick={() => setScale((s) => Math.max(MIN_SCALE, s - SCALE_STEP))}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                  title="Zoom out"
                >
                  <ZoomOut className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={() => setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP))}
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
                  className="w-full h-[300px] rounded-xl border-2 border-gray-200 overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundColor: selectedColor ? `#${selectedColor}` : "#f9fafb",
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
                    <p className="text-gray-400 text-center">Preview will appear here</p>
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
