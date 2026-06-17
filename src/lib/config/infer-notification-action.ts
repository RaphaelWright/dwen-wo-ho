import {
  CURATOR_NOTIFICATION_ACTIONS,
  PROVIDER_NOTIFICATION_ACTIONS,
  VALID_PROVIDER_NOTIFICATION_ACTIONS,
  VALID_CURATOR_NOTIFICATION_ACTIONS,
} from "@/lib/constants";
import type {
  CuratorNotification,
  ProviderNotification,
} from "@/lib/types/entities/notification";

const PROVIDER_PATIENT_CATEGORIES = new Set([
  "NEW_PATIENT_ADDED",
  "STAR_PROVIDER_ASSIGNED",
]);

const PROVIDER_PATIENT_TARGETS = new Set(["PATIENT_RESULT", "PATIENT"]);

const CURATOR_PATIENT_TYPES = new Set([
  "NEW_PATIENT_ADDED",
  "PATIENT_LOCK_IN",
  "PATIENT_REFERRED",
]);

const CURATOR_PATIENT_ENTITIES = new Set(["PATIENT_RESULT", "PATIENT"]);

const CURATOR_PROVIDER_TYPES = new Set([
  "PROVIDER_REGISTRATION",
  "PROVIDER_APPLICATION_UPDATE",
  "PROVIDER_SCHOOL_CHANGE",
]);

const CURATOR_PROVIDER_ENTITIES = new Set(["PROVIDER", "USER"]);

const CURATOR_SCHOOL_TYPES = new Set([
  "SCHOOL_REGISTRATION",
  "OPEN_PATIENTS_AVAILABLE",
  "CRITICAL_ALERT",
]);

const PROVIDER_TARGET_ACTIONS: Record<string, string> = {
  URGENT_CARE: PROVIDER_NOTIFICATION_ACTIONS.OPEN_URGENT_CARE,
  SCHOOL: PROVIDER_NOTIFICATION_ACTIONS.OPEN_PROVIDER_SCHOOL,
};

function isProviderPatientSignal(
  category: string,
  targetType: string,
): boolean {
  return (
    PROVIDER_PATIENT_CATEGORIES.has(category) ||
    PROVIDER_PATIENT_TARGETS.has(targetType)
  );
}

function isCuratorPatientSignal(
  type: string,
  relatedEntityType: string,
): boolean {
  return (
    CURATOR_PATIENT_TYPES.has(type) ||
    CURATOR_PATIENT_ENTITIES.has(relatedEntityType)
  );
}

function isCuratorProviderSignal(
  type: string,
  relatedEntityType: string,
): boolean {
  return (
    CURATOR_PROVIDER_TYPES.has(type) ||
    CURATOR_PROVIDER_ENTITIES.has(relatedEntityType)
  );
}

function isCuratorSchoolSignal(
  type: string,
  relatedEntityType: string,
): boolean {
  return CURATOR_SCHOOL_TYPES.has(type) || relatedEntityType === "SCHOOL";
}

function resolveProviderFallbackAction(
  category: string,
  targetType: string,
): string | null {
  if (isProviderPatientSignal(category, targetType)) {
    return PROVIDER_NOTIFICATION_ACTIONS.OPEN_PATIENT;
  }
  return PROVIDER_TARGET_ACTIONS[targetType] ?? null;
}

function resolveCuratorFallbackAction(
  type: string,
  relatedEntityType: string,
): string | null {
  if (isCuratorPatientSignal(type, relatedEntityType)) {
    return CURATOR_NOTIFICATION_ACTIONS.OPEN_PATIENT;
  }
  if (isCuratorProviderSignal(type, relatedEntityType)) {
    return CURATOR_NOTIFICATION_ACTIONS.OPEN_PROVIDER;
  }
  if (isCuratorSchoolSignal(type, relatedEntityType)) {
    return CURATOR_NOTIFICATION_ACTIONS.OPEN_SCHOOL;
  }
  return null;
}

function normalizeNotificationAction(
  action: string,
  validActions: string[],
  fallback: string | null,
): string | null {
  const candidates = [action, fallback].filter(Boolean) as string[];
  return (
    candidates.find((candidate) => validActions.includes(candidate)) ?? null
  );
}

export function inferProviderNotificationAction(notification: {
  action: string;
  category: ProviderNotification["category"];
  targetType: string;
}): string | null {
  const validActions = VALID_PROVIDER_NOTIFICATION_ACTIONS as string[];
  const fallback = resolveProviderFallbackAction(
    notification.category,
    notification.targetType,
  );

  return normalizeNotificationAction(
    notification.action,
    validActions,
    fallback,
  );
}

export function inferCuratorNotificationAction(notification: {
  action: string;
  type: CuratorNotification["type"];
  relatedEntityType: string;
}): string | null {
  const validActions = VALID_CURATOR_NOTIFICATION_ACTIONS as string[];
  const fallback = resolveCuratorFallbackAction(
    notification.type,
    notification.relatedEntityType,
  );

  return normalizeNotificationAction(
    notification.action,
    validActions,
    fallback,
  );
}
