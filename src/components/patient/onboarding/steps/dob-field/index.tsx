"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ONBOARDING_COPY,
  ONBOARDING_DOB_DAYS,
  ONBOARDING_DOB_DEFAULT_YEAR,
  ONBOARDING_DOB_MONTHS,
  ONBOARDING_DOB_YEARS,
} from "@/lib/constants/components/patient/onboarding";
import type { DobFieldProps } from "@/lib/types/components/patient/onboarding";
import {
  getBirthDateHints,
  ordinalSuffix,
} from "@/lib/utils/patient/birth-date";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";
import { cn } from "@/lib/utils";

type DobFieldKey = "day" | "month" | "year";

const DOB_FIELD_LABELS: Record<DobFieldKey, string> = {
  day: "Day",
  month: "Month",
  year: "Year",
};

function monthAbbr(month: string): string {
  return month.slice(0, 3);
}

export function DobField({
  birthMonth,
  birthDay,
  birthYear,
  onChange,
}: DobFieldProps) {
  const [openField, setOpenField] = useState<DobFieldKey | null>(null);
  const [panelStyle, setPanelStyle] = useState<CSSProperties | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Partial<Record<DobFieldKey, HTMLDivElement>>>({});
  const yearPanelRef = useRef<HTMLDivElement>(null);

  const hints = getBirthDateHints({
    day: birthDay,
    month: birthMonth,
    year: birthYear,
  });

  const positionOpenPanel = useCallback((field: DobFieldKey) => {
    const trigger = triggerRefs.current[field];
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    setPanelStyle({
      position: "fixed",
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      zIndex: 200,
    });
  }, []);

  useEffect(() => {
    if (!openField) {
      setPanelStyle(null);
      return;
    }

    positionOpenPanel(openField);

    const handleReposition = () => positionOpenPanel(openField);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [openField, positionOpenPanel]);

  useEffect(() => {
    if (!openField) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || rootRef.current?.contains(target)) {
        return;
      }
      setOpenField(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [openField]);

  useEffect(() => {
    if (openField !== "year" || !yearPanelRef.current) {
      return;
    }

    const target = Array.from(yearPanelRef.current.children).find(
      (item) => item.textContent === ONBOARDING_DOB_DEFAULT_YEAR,
    );

    if (target instanceof HTMLElement) {
      target.scrollIntoView({ block: "center" });
    }
  }, [openField]);

  const handleTriggerClick = (field: DobFieldKey) => {
    const isOpen = openField === field;
    setOpenField(null);
    if (!isOpen) {
      setOpenField(field);
    }
  };

  const selectValue = (field: DobFieldKey, value: string) => {
    if (field === "day") {
      onChange({ birthDay: value });
    } else if (field === "month") {
      onChange({ birthMonth: value });
    } else {
      onChange({ birthYear: value });
    }
    setOpenField(null);
  };

  const renderValues = (field: DobFieldKey): string[] => {
    if (field === "day") {
      return ONBOARDING_DOB_DAYS;
    }
    if (field === "month") {
      return [...ONBOARDING_DOB_MONTHS];
    }
    return ONBOARDING_DOB_YEARS;
  };

  const triggerLabel = (field: DobFieldKey): string => {
    if (field === "day" && birthDay) {
      return birthDay;
    }
    if (field === "month" && birthMonth) {
      return monthAbbr(birthMonth);
    }
    if (field === "year" && birthYear) {
      return birthYear;
    }
    return DOB_FIELD_LABELS[field];
  };

  const hasSelection = (field: DobFieldKey): boolean => {
    if (field === "day") {
      return Boolean(birthDay);
    }
    if (field === "month") {
      return Boolean(birthMonth);
    }
    return Boolean(birthYear);
  };

  const isValueSelected = (field: DobFieldKey, value: string): boolean => {
    if (field === "day") {
      return birthDay === value;
    }
    if (field === "month") {
      return birthMonth === value;
    }
    return birthYear === value;
  };

  return (
    <div className="field-group" ref={rootRef}>
      <div className="dob-title-row">
        <div className="box-title">{ONBOARDING_COPY.createAccount.dob}</div>
        {hints ? (
          <div
            className={cn("age-chip", "show")}
            aria-label={`Age ${hints.age}`}
          >
            {hints.age}
            {ONBOARDING_COPY.createAccount.dobAgeSuffix}
          </div>
        ) : (
          <div className="age-chip" />
        )}
      </div>

      <div className="dob-row">
        {(["day", "month", "year"] as const).map((field) => (
          <div key={field} className="dob-dropdown" data-field={field}>
            <div
              ref={(node) => {
                triggerRefs.current[field] = node ?? undefined;
              }}
              role="button"
              tabIndex={0}
              className={cn(
                "dob-trigger",
                hasSelection(field) && "chosen",
                openField === field && "open",
              )}
              data-trigger={field}
              onClick={(event) => {
                event.stopPropagation();
                handleTriggerClick(field);
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
                activateOnKeyboard(() => handleTriggerClick(field))(event);
              }}
            >
              {triggerLabel(field)}
            </div>
            <div
              ref={field === "year" ? yearPanelRef : undefined}
              className={cn("dob-panel", openField === field && "open")}
              data-panel={field}
              style={
                openField === field ? (panelStyle ?? undefined) : undefined
              }
            >
              {renderValues(field).map((value) => (
                <div
                  key={value}
                  role="button"
                  tabIndex={0}
                  className={cn(isValueSelected(field, value) && "active")}
                  onClick={(event) => {
                    event.stopPropagation();
                    selectValue(field, value);
                  }}
                  onKeyDown={(event) => {
                    event.stopPropagation();
                    activateOnKeyboard(() => selectValue(field, value))(event);
                  }}
                >
                  {field === "month" ? monthAbbr(value) : value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {hints ? (
        <p className="dob-message">
          {ONBOARDING_COPY.createAccount.dobBornOnPrefix}{" "}
          <strong>
            {hints.weekday}, {ordinalSuffix(Number.parseInt(birthDay, 10))}{" "}
            {hints.month}, {hints.year}
          </strong>
          .
        </p>
      ) : (
        <p className="dob-message" />
      )}
    </div>
  );
}
