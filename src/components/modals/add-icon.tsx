"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { School } from "@/types/school";
import { Lock } from "lucide-react";

interface AddIconModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    photo: File | null;
    name: string;
    slogan: string;
    rank: number;
  }) => void;
  editData?: {
    photoPreview: string;
    name: string;
    slogan: string;
    rank: number;
  } | null;
  selectedSchool: School | null;
  lockIns: Array<{
    studentName: string;
    lockinScore: number;
    lockedInInterpretation: string;
    lockedInColor: string;
  }>;
}

export default function AddIconModal({
  isOpen,
  onClose,
  onComplete,
  editData = null,
  selectedSchool,
  lockIns,
}: AddIconModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [rank, setRank] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load edit data when modal opens
  useEffect(() => {
    if (isOpen && editData) {
      setPhotoPreview(editData.photoPreview);
      setName(editData.name);
      setSlogan(editData.slogan);
      setRank(editData.rank);
    } else if (isOpen && !editData) {
      // Reset for new icon
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setName("");
      setSlogan("");
      setRank(1);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen, editData]);

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

  const handleSubmit = () => {
    if (name.trim() && slogan.trim()) {
      onComplete({
        photo: selectedPhoto,
        name: name.trim(),
        slogan: slogan.trim(),
        rank,
      });
      // Reset state
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setName("");
      setSlogan("");
      setRank(1);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getFirstCampus = (campuses: string[] | null | undefined): string => {
    if (campuses && Array.isArray(campuses) && campuses.length > 0) {
      return campuses[0];
    }
    return "";
  };

  const firstCampus = getFirstCampus(selectedSchool?.campuses);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col border-2 border-[#955aa4]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <button
            onClick={onClose}
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
            {editData ? "Edit Icon" : "New Icons"}
          </h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content - Two Column Layout */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left Side - Preview */}
            <div className="flex flex-col space-y-4 h-full">
              <div className="relative w-full flex-1 min-h-[400px] rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
                {photoPreview ? (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 z-0"
                    >
                      <Image
                        src={photoPreview}
                        alt={name || "Icon preview"}
                        fill
                        className="object-cover"
                      />
                    </button>
                    {/* Rank Badge */}
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white border-2 border-black flex items-center justify-center z-10">
                      <span className="text-black font-bold text-lg">#{rank}</span>
                    </div>
                    {/* Name Overlay */}
                    {name && (
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent z-10">
                        <p className="text-white text-3xl font-bold">{name}</p>
                        {slogan && (
                          <p className="text-white/90 text-lg mt-1">{slogan}</p>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg
                        className="w-16 h-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* School Info */}
              {selectedSchool && (
                <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                  {selectedSchool.logo ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      <Image
                        src={selectedSchool.logo}
                        alt={selectedSchool.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🏫</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {selectedSchool.name}
                    </p>
                    {firstCampus && (
                      <p className="text-sm text-gray-500">{firstCampus}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Lock-ins Section */}
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-3">
                  Lock-ins ({lockIns.length})
                </h3>
                {lockIns.length > 0 ? (
                  <div className="space-y-2">
                    {lockIns.map((lockIn, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm text-gray-700"
                      >
                        <span className="flex-1 text-left">{lockIn.studentName}</span>
                        <Lock className="w-4 h-4 text-yellow-500 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No lock-ins yet</p>
                )}
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
                />
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

              {/* Photo Button */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Photo
                </label>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-gray-900"
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

              {/* Rank Control */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Rank
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setRank(Math.max(1, rank - 1))}
                    className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                    {rank}
                  </span>
                  <button
                    onClick={() => setRank(rank + 1)}
                    className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with GO Button */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !slogan.trim()}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              !name.trim() || !slogan.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            GO
          </button>
        </div>
      </div>
    </div>
  );
}
