"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CAMPUS_OPTIONS } from "@/lib/constants/components/modals/school-creation";
import { SCHOOL_TYPES } from "@/lib/constants/components/modals/school-edit";
import { SchoolEditFormProps } from "@/lib/types/components/modals/school-edit";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const SchoolEditForm = ({
  formData,
  handleInputChange,
  showCampusDropdown,
  setShowCampusDropdown,
  selectedCampuses,
  handleCampusToggle,
  campusDropdownRef,
  handleSubmit,
  school,
}: SchoolEditFormProps) => {
  return (
    <form id="school-edit-form" onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">
            School Name
          </Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            placeholder="e.g. Achimota School"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">
            Nickname (Optional)
          </Label>
          <Input
            type="text"
            value={formData.nickname}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            placeholder="e.g. Motown"
          />
        </div>
      </div>

      {/* Motto */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">
          Motto <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={formData.motto}
          onChange={(e) => handleInputChange("motto", e.target.value)}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-foreground placeholder:text-muted-foreground"
          placeholder="Enter school motto"
          rows={3}
        />
      </div>

      <div className="flex items-center gap-6">
        <Label className="text-lg font-bold text-foreground w-24">Type</Label>
        <div className="flex-1 flex gap-4 flex-wrap">
          {SCHOOL_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              onClick={() => handleInputChange("type", type)}
              className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                formData.type === type
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground">
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
            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-left flex items-center justify-between hover:bg-muted transition-colors h-auto"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span
                className={
                  selectedCampuses.length > 0
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }
              >
                {selectedCampuses.length > 0
                  ? selectedCampuses.join(", ")
                  : "Select campus locations"}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
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
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden"
              >
                <div className="max-h-48 overflow-y-auto p-2">
                  {CAMPUS_OPTIONS.map((campus) => (
                    <Button
                      key={campus}
                      type="button"
                      onClick={() => handleCampusToggle(campus)}
                      variant="ghost"
                      className={`w-full justify-start px-4 py-2.5 rounded-lg transition-colors ${
                        selectedCampuses.includes(campus)
                          ? "bg-primary/10 text-primary font-medium hover:bg-primary/20"
                          : "hover:bg-muted text-foreground"
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

      {school.logo && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">
            School Logo
          </Label>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="inline-block">
                <Image
                  src={school.logo}
                  alt="School logo"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-lg border border-border shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
