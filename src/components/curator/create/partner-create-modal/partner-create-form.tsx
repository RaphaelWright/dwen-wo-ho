"use client";

import { Upload, Building2 } from "lucide-react";
import Image from "next/image";
import type { PartnerCreateFormProps } from "@/lib/types/components/curator/create/create";

export function PartnerCreateForm({
  name,
  setName,
  nickname,
  setNickname,
  slogan,
  setSlogan,
  logo,
  fileInputRef,
  onPickLogo,
  onFileChange,
  onSubmit,
}: PartnerCreateFormProps) {
  return (
    <div className="p-8">
      <form id="partner-form" onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="partner-name"
            className="text-foreground text-sm font-semibold"
          >
            Partner Name
          </label>
          <div className="relative">
            <input
              id="partner-name"
              aria-label="Partner name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-muted border-border focus:ring-primary/20 focus:border-primary w-full rounded-xl border py-3 pr-4 pl-12 transition-all focus:ring-2 focus:outline-none"
              placeholder="e.g. Ministry of Health"
            />
            <Building2 className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="partner-nickname"
            className="text-foreground text-sm font-semibold"
          >
            Nickname (Optional)
          </label>
          <input
            id="partner-nickname"
            aria-label="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="bg-muted border-border focus:ring-primary/20 focus:border-primary w-full rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="e.g. MoH"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="partner-slogan"
            className="text-foreground text-sm font-semibold"
          >
            Slogan
          </label>
          <input
            id="partner-slogan"
            aria-label="Slogan"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            className="bg-muted border-border focus:ring-primary/20 focus:border-primary w-full rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="e.g. The Sound Of Young America"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="partner-logo"
            className="text-foreground text-sm font-semibold"
          >
            Partner Logo
          </label>
          <input
            id="partner-logo"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            aria-label="Upload logo"
            className="hidden"
            onChange={onFileChange}
          />
          <button
            type="button"
            onClick={onPickLogo}
            className="bg-muted border-border hover:bg-muted/80 hover:border-primary/30 group relative flex h-32 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all"
          >
            {logo ? (
              <div className="relative h-full w-full p-4">
                <Image
                  src={logo}
                  alt="Logo preview"
                  width={128}
                  height={128}
                  className="h-full w-full object-contain"
                />
                <div className="bg-foreground/0 group-hover:bg-foreground/10 absolute inset-0 flex items-center justify-center transition-colors">
                  <span className="bg-background/90 rounded-full px-3 py-1 text-xs font-medium opacity-0 shadow-sm group-hover:opacity-100">
                    Change
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110">
                  <Upload className="text-primary h-5 w-5" />
                </div>
                <span className="text-muted-foreground group-hover:text-primary text-sm font-medium transition-colors">
                  Click to upload logo
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
