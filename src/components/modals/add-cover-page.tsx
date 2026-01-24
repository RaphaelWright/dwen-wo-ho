"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface AddCoverPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { photo: File | null; color: string; slogan: string }) => void;
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

type Step = "photo-color" | "slogan";

export default function AddCoverPageModal({
  isOpen,
  onClose,
  onComplete,
}: AddCoverPageModalProps) {
  const [step, setStep] = useState<Step>("photo-color");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [slogan, setSlogan] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const handleGoToSlogan = () => {
    if (selectedPhoto && selectedColor) {
      setStep("slogan");
    }
  };

  const handleSubmit = () => {
    if (slogan.trim()) {
      onComplete({
        photo: selectedPhoto,
        color: selectedColor,
        slogan: slogan.trim(),
      });
      // Reset state
      setStep("photo-color");
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setSelectedColor("");
      setSlogan("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleBack = () => {
    if (step === "slogan") {
      setStep("photo-color");
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

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
          <h2 className="text-2xl font-bold text-gray-900">
            {step === "photo-color" ? "Add Cover Page" : "Slogan"}
          </h2>
          <button
            onClick={step === "photo-color" ? handleGoToSlogan : handleSubmit}
            disabled={
              step === "photo-color"
                ? !selectedPhoto || !selectedColor
                : !slogan.trim()
            }
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              step === "photo-color"
                ? !selectedPhoto || !selectedColor
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                : !slogan.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            GO
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "photo-color" ? (
            <div className="space-y-6">
              {/* Photo and Colors Section - Same Line */}
              <div className="flex items-end gap-4">
                {/* Photo Section */}
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

                {/* Colors Section */}
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

                  {/* Color Dropdown */}
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

              {/* Separator Line */}
              <div className="border-b border-gray-200"></div>

              {/* Image Preview Area */}
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
                    <p className="text-gray-400 text-center">
                      Add photo to get started
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview - Still visible in slogan step */}
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
                    <p className="text-gray-400 text-center">
                      Preview will appear here
                    </p>
                  )}
                </div>
              </div>

              {/* Slogan Input */}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
