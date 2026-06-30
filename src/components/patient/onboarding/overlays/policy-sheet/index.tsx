"use client";

import { useCallback, useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { OnboardingBrandLogo } from "@/components/patient/onboarding/brand-logo";
import {
  ONBOARDING_COPY,
  ONBOARDING_POLICY_CANADA_CONTACT,
  ONBOARDING_POLICY_CANADA_SECTIONS,
  ONBOARDING_POLICY_TERMS_SECTIONS,
} from "@/lib/constants/components/patient/onboarding";
import type {
  OnboardingPolicyFeatureSection,
  OnboardingPolicyTextPart,
  PolicySheetProps,
} from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

function renderTextParts(
  parts: readonly OnboardingPolicyTextPart[],
): ReactNode {
  return parts.map((part, index) =>
    part.accent ? (
      <span key={`${part.text}-${index}`} className={part.accent}>
        {part.text}
      </span>
    ) : (
      <span key={`${part.text}-${index}`}>{part.text}</span>
    ),
  );
}

function PolicyFeatureCard({
  section,
}: {
  section: OnboardingPolicyFeatureSection;
}) {
  return (
    <div className="policy-feature">
      <div className="policy-photo">
        {/* eslint-disable-next-line @next/next/no-img-element -- mock layout uses cover-fit editorial photos */}
        <img src={section.imageSrc} alt={section.imageAlt} />
      </div>
      <div className="policy-text">
        <p className="num">{section.num}</p>
        <h3>
          {section.headingPrefix}
          {section.heading ? (
            section.headingAccent ? (
              <span className={section.headingAccent}>{section.heading}</span>
            ) : (
              section.heading
            )
          ) : null}
          {section.headingSuffix}
        </h3>
        <p>{section.body}</p>
      </div>
    </div>
  );
}

export function PolicySheet({ open, onOpenChange, variant }: PolicySheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const scrollHintId = useId();
  const overlayId = variant === "canada-us" ? "overlay" : "overlay2";
  const sheetDomId = variant === "canada-us" ? "sheet" : "sheet2";
  const mounted = typeof document !== "undefined";

  const handleScroll = useCallback(() => {
    const sheet = sheetRef.current;
    if (!sheet) {
      return;
    }
    sheet.classList.toggle("expanded", sheet.scrollTop > 24);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const canadaCopy = ONBOARDING_COPY.policySheets.canadaUs;
  const termsCopy = ONBOARDING_COPY.policySheets.terms;

  if (!open || !mounted) {
    return null;
  }

  const heroCopy = variant === "canada-us" ? canadaCopy : termsCopy;

  const sheet = (
    <div className="patient-onboarding">
      <div
        className={cn("popup-overlay", "open")}
        id={overlayId}
        onClick={() => onOpenChange(false)}
      />

      <div
        ref={sheetRef}
        className={cn("popup-sheet", "open")}
        id={sheetDomId}
        onScroll={handleScroll}
      >
        <div className="sheet-logo">
          <OnboardingBrandLogo placement="policy-sheet" />
        </div>
        <div className="scroll-hint" id={scrollHintId}>
          {heroCopy.scrollHint}
        </div>

        <div className="policy-hero">
          <p className="eyebrow">{heroCopy.eyebrow}</p>
          <h2>
            {heroCopy.titlePrefix}
            <span className={heroCopy.titleAccentClass}>
              {heroCopy.titleAccent}
            </span>
            {"titleSuffix" in heroCopy ? heroCopy.titleSuffix : null}
          </h2>
          <p className="lede">{renderTextParts(heroCopy.lede)}</p>
        </div>

        <div className="policy-features">
          {(variant === "canada-us"
            ? ONBOARDING_POLICY_CANADA_SECTIONS
            : ONBOARDING_POLICY_TERMS_SECTIONS
          ).map((section) => (
            <PolicyFeatureCard key={section.num} section={section} />
          ))}
        </div>

        {variant === "canada-us" ? (
          <div className="ca-contact">
            <p className="ca-contact-label">{canadaCopy.contactLabel}</p>
            <div className="contact-list">
              {ONBOARDING_POLICY_CANADA_CONTACT.rows.map((row) => (
                <div key={row.label} className="contact-row">
                  <span className="label">{row.label}</span>
                  <span className="value">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="policy-closing">
            <p>{renderTextParts(termsCopy.closing)}</p>
          </div>
        )}
      </div>

      <button
        className={cn("popup-close-btn", "open")}
        type="button"
        aria-label={ONBOARDING_COPY.policySheets.closeLabel}
        onClick={() => onOpenChange(false)}
      >
        &times;
      </button>
    </div>
  );

  return createPortal(sheet, document.body);
}
