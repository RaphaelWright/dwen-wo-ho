"use client";

import { Building2 } from "lucide-react";
import { escapeHtml } from "@/lib/utils/curator/create/escape-html";
import type { PreviewPanelProps } from "@/lib/types/components/curator/create/creative-studios";
import Image from "next/image";

export function PreviewPanel({
  name,
  nick,
  type,
  loc,
  motto,
  showLogo,
  logoUrl,
  photoUrl,
}: PreviewPanelProps) {
  const displayName = name || "—";
  const displayNick = nick || "";
  const typeLine = [type, loc].filter(Boolean).join(", ");
  const displayMotto = motto || "";

  return (
    <div className="relative h-full overflow-hidden">
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- blob preview URL
        <img
          src={photoUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src="/auth/cs-preview-panel.png"
          alt="Preview Panel"
          width={1080}
          height={1080}
          quality={100}
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div aria-hidden className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 flex items-center justify-center px-5 pb-24">
        {showLogo ? (
          <div className="flex size-28 flex-col items-center justify-center overflow-hidden rounded-full border-5 border-white bg-white/95 shadow-xl">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- blob preview URL
              <img src={logoUrl} alt="" className="size-full object-cover" />
            ) : (
              <>
                <Building2 className="size-8 text-gray-400" />
                <span className="mt-1 text-center text-[10px] font-medium text-gray-400">
                  Logo
                </span>
              </>
            )}
          </div>
        ) : null}
      </div>
      <div className="bg-background/5 absolute right-0 bottom-0 left-0 px-5 py-5 text-center text-white backdrop-blur-xs backdrop-saturate-[1.2]">
        {displayNick ? (
          <div className="mb-0.5 text-[11px] font-medium opacity-85">
            {escapeHtml(displayNick)}
          </div>
        ) : null}
        <div className="mb-0.5 text-lg leading-tight font-semibold">
          {escapeHtml(displayName)}
        </div>
        {typeLine ? (
          <div className="mb-0.5 text-xs font-medium opacity-90">
            {escapeHtml(typeLine)}
          </div>
        ) : null}
        {displayMotto ? (
          <div className="text-[11px] italic opacity-75">
            &ldquo;{escapeHtml(displayMotto)}&rdquo;
          </div>
        ) : null}
      </div>
    </div>
  );
}
