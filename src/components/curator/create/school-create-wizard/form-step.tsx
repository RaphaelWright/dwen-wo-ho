"use client";

import { MapPin, ChevronDown, Upload, X } from "lucide-react";
import { m, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  CAMPUS_OPTIONS,
  SCHOOL_TYPES,
} from "@/lib/constants/components/curator/schools/school-forms";
import { SchoolCreateFormStepProps } from "@/lib/types/components/curator/create/create";
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
}: SchoolCreateFormStepProps) => {
  return (
    <form id="school-form" className="space-y-8">
      {/* Name & Nickname */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="school-name"
            className="text-foreground text-sm font-semibold"
          >
            School Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="school-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="bg-muted border-border focus:ring-primary/20 focus:border-primary w-full rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="e.g. Achimota School"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="school-nickname"
            className="text-foreground text-sm font-semibold"
          >
            Nickname (Optional)
          </label>
          <Input
            id="school-nickname"
            type="text"
            value={formData.nickname}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
            className="bg-muted border-border focus:ring-primary/20 focus:border-primary w-full rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="e.g. Motown"
          />
        </div>
      </div>

      {/* Motto */}
      <div className="space-y-2">
        <Label className="text-foreground text-sm font-semibold">
          Motto <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={formData.motto}
          onChange={(e) => handleInputChange("motto", e.target.value)}
          className="bg-muted border-border focus:ring-primary/20 focus:border-primary w-full resize-none rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
          placeholder="Enter school motto"
          rows={3}
        />
      </div>

      {/* Type */}
      <div className="space-y-3">
        <Label className="text-foreground text-sm font-semibold">
          Type <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-4">
          {SCHOOL_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              onClick={() => handleInputChange("type", type)}
              className={`flex-1 rounded-lg px-6 py-3 font-bold transition-colors ${
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
          <Label className="text-foreground text-sm font-semibold">
            Campuses
          </Label>
          {selectedCampuses.length > 0 && (
            <span className="text-secondary-accent bg-secondary-accent/10 rounded-full px-2 py-1 text-xs font-medium">
              {selectedCampuses.length} selected
            </span>
          )}
        </div>
        <div className="relative" ref={campusDropdownRef}>
          <Button
            type="button"
            onClick={() => setShowCampusDropdown(!showCampusDropdown)}
            className="bg-muted border-border hover:bg-muted/80 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors"
          >
            <div className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span
                className={
                  selectedCampuses.length > 0
                    ? "text-foreground"
                    : "text-muted-foreground"
                }
              >
                {selectedCampuses.length > 0
                  ? selectedCampuses.join(", ")
                  : "Select campus locations"}
              </span>
            </div>
            <ChevronDown
              className={`text-muted-foreground h-4 w-4 transition-transform duration-200 ${
                showCampusDropdown ? "rotate-180" : ""
              }`}
            />
          </Button>

          <AnimatePresence>
            {showCampusDropdown && (
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-card border-border absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-xl border shadow-xl"
              >
                <div className="max-h-48 overflow-y-auto p-2">
                  {CAMPUS_OPTIONS.map((campus) => (
                    <Button
                      key={campus}
                      type="button"
                      onClick={() => handleCampusToggle(campus)}
                      className={`w-full rounded-lg border-0 bg-transparent px-4 py-2.5 text-left shadow-none transition-colors ${
                        selectedCampuses.includes(campus)
                          ? "bg-muted text-foreground font-medium"
                          : "hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <span>{campus}</span>
                    </Button>
                  ))}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Logo */}
      <div className="space-y-3">
        <Label className="text-foreground text-sm font-semibold">
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
                  className="h-32 w-32 rounded-lg border object-cover shadow-sm"
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
                    className="bg-primary/80 hover:bg-primary text-primary-foreground cursor-pointer rounded-full p-1.5 transition-colors"
                    title="Change logo"
                  >
                    <Upload size={12} />
                  </Label>
                  <Button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="bg-foreground/60 hover:bg-foreground/80 text-background rounded-full p-1 transition-colors"
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
                  className="bg-muted border-border hover:bg-muted/80 hover:border-primary/30 group flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all"
                >
                  <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110">
                    <Upload className="text-secondary-accent h-5 w-5" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-primary text-sm font-medium transition-colors">
                    Click to upload logo
                  </span>
                  <span className="text-muted-foreground mt-1 text-xs">
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
