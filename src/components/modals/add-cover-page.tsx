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
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 100 100"
              className="rotate-180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M66.92,39.4a29.45,29.45,0,0,0,5,4.54H3.5V56H71.94a29.39,29.39,0,0,0-5,4.53c-12.6,14.46-9.44,37.08-9.3,38.1l8.79,0c0-.21-2.73-20.94,7.22-32.33C78,61.41,84,56.05,92.07,56.05H96.5V43.9H92.07C84,43.9,78,38.54,73.63,33.59c-9.95-11.38-7.25-32-7.22-32.21l-8.79-.07C57.48,2.33,54.32,24.94,66.92,39.4Z"
                fill="currentColor"
                className="text-gray-900"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {step === "photo-color" ? "Add Cover Page" : "Slogan"}
          </h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "photo-color" ? (
            <div className="space-y-6">
              {/* Photo Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Photo
                </label>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
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
              <div className="relative" ref={colorDropdownRef}>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Colors
                </label>
                <button
                  onClick={() => setShowColorDropdown(!showColorDropdown)}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-between"
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

              {/* Image Preview Area */}
              <div className="mt-6">
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

        {/* Footer with GO Button */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={step === "photo-color" ? handleGoToSlogan : handleSubmit}
            disabled={
              step === "photo-color"
                ? !selectedPhoto || !selectedColor
                : !slogan.trim()
            }
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
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
      </div>
    </div>
  );
}
