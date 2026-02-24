"use client";

import { MapPin, ChevronDown, Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  CAMPUS_OPTIONS,
  SCHOOL_TYPES,
} from "@/lib/constants/components/modals/school-creation";
import { FormStepProps } from "@/lib/types/components/modals/school-creation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const FormStep = ({
  formData,
  handleInputChange,
  showCampusDropdown,
  setShowCampusDropdown,
  selectedCampuses,
  handleCampusToggle,
  campusDropdownRef,
  handleLogoUpload,
  handleRemoveLogo,
}: FormStepProps) => {
  return (
    <form id="school-form" className="space-y-8">
      {/* Name & Nickname */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            School Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="e.g. Achimota School"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Nickname (Optional)
          </label>
          <Input
            type="text"
            value={formData.nickname}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="e.g. Motown"
          />
        </div>
      </div>

      {/* Motto */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">
          Motto <span className="text-red-500">*</span>
        </Label>
        <Textarea
          value={formData.motto}
          onChange={(e) => handleInputChange("motto", e.target.value)}
          className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          placeholder="Enter school motto"
          rows={3}
        />
      </div>

      {/* Type */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">
          Type <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-4">
          {SCHOOL_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              onClick={() => handleInputChange("type", type)}
              className={`flex-1 px-6 py-3 rounded-lg font-bold transition-colors ${
                formData.type === type
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Campuses */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">
            Campuses
          </Label>
          {selectedCampuses.length > 0 && (
            <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
              {selectedCampuses.length} selected
            </span>
          )}
        </div>
        <div className="relative" ref={campusDropdownRef}>
          <Button
            type="button"
            onClick={() => setShowCampusDropdown(!showCampusDropdown)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span
                className={
                  selectedCampuses.length > 0
                    ? "text-gray-900"
                    : "text-gray-500"
                }
              >
                {selectedCampuses.length > 0
                  ? selectedCampuses.join(", ")
                  : "Select campus locations"}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                showCampusDropdown ? "rotate-180" : ""
              }`}
            />
          </Button>

          <AnimatePresence>
            {showCampusDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden"
              >
                <div className="max-h-48 overflow-y-auto p-2">
                  {CAMPUS_OPTIONS.map((campus) => (
                    <Button
                      key={campus}
                      type="button"
                      onClick={() => handleCampusToggle(campus)}
                      className={`bg-transparent shadow-none border-0 w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                        selectedCampuses.includes(campus)
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span>{campus}</span>
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Logo */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">
          School Logo
        </Label>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            {formData.logo ? (
              <div className="relative inline-block">
                <Image
                  src={URL.createObjectURL(formData.logo)}
                  alt="Uploaded logo"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                />
                <div className="absolute top-1 right-1 flex gap-1">
                  <Input
                    type="file"
                    id="logo-change"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Label
                    htmlFor="logo-change"
                    className="bg-primary/80 hover:bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer transition-colors"
                    title="Change logo"
                  >
                    <Upload size={12} />
                  </Label>
                  <Button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                    title="Remove logo"
                  >
                    <X size={12} />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="logo-upload"
                  className="w-full h-32 bg-muted border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 hover:border-primary/30 transition-all group"
                >
                  <div className="w-10 h-10 bg-background rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    Click to upload logo
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 5MB
                  </span>
                </Label>
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
