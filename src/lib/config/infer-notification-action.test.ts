import { describe, expect, it } from "vitest";
import {
  inferCuratorNotificationAction,
  inferProviderNotificationAction,
} from "./infer-notification-action";
import {
  CURATOR_NOTIFICATION_ACTIONS,
  PROVIDER_NOTIFICATION_ACTIONS,
} from "@/lib/constants";

describe("inferProviderNotificationAction", () => {
  it("returns valid backend action when already recognized", () => {
    expect(
      inferProviderNotificationAction({
        action: PROVIDER_NOTIFICATION_ACTIONS.OPEN_URGENT_CARE,
        category: "NEW_PATIENT_ADDED",
        targetType: "PATIENT",
      }),
    ).toBe(PROVIDER_NOTIFICATION_ACTIONS.OPEN_URGENT_CARE);
  });

  it("infers OPEN_PATIENT from patient category", () => {
    expect(
      inferProviderNotificationAction({
        action: "UNKNOWN",
        category: "NEW_PATIENT_ADDED",
        targetType: "OTHER",
      }),
    ).toBe(PROVIDER_NOTIFICATION_ACTIONS.OPEN_PATIENT);
  });

  it("infers OPEN_URGENT_CARE from target type", () => {
    expect(
      inferProviderNotificationAction({
        action: "",
        category: "GENERAL" as "NEW_PATIENT_ADDED",
        targetType: "URGENT_CARE",
      }),
    ).toBe(PROVIDER_NOTIFICATION_ACTIONS.OPEN_URGENT_CARE);
  });

  it("infers OPEN_PROVIDER_SCHOOL from school target type", () => {
    expect(
      inferProviderNotificationAction({
        action: "INVALID",
        category: "GENERAL" as "NEW_PATIENT_ADDED",
        targetType: "SCHOOL",
      }),
    ).toBe(PROVIDER_NOTIFICATION_ACTIONS.OPEN_PROVIDER_SCHOOL);
  });

  it("returns null when action cannot be inferred", () => {
    expect(
      inferProviderNotificationAction({
        action: "INVALID",
        category: "GENERAL" as "NEW_PATIENT_ADDED",
        targetType: "OTHER",
      }),
    ).toBeNull();
  });
});

describe("inferCuratorNotificationAction", () => {
  it("returns valid backend action when already recognized", () => {
    expect(
      inferCuratorNotificationAction({
        action: CURATOR_NOTIFICATION_ACTIONS.OPEN_SCHOOL,
        type: "SCHOOL_REGISTRATION",
        relatedEntityType: "SCHOOL",
      }),
    ).toBe(CURATOR_NOTIFICATION_ACTIONS.OPEN_SCHOOL);
  });

  it("infers OPEN_PATIENT from patient-related type", () => {
    expect(
      inferCuratorNotificationAction({
        action: "",
        type: "PATIENT_LOCK_IN",
        relatedEntityType: "OTHER",
      }),
    ).toBe(CURATOR_NOTIFICATION_ACTIONS.OPEN_PATIENT);
  });

  it("infers OPEN_PROVIDER from provider registration type", () => {
    expect(
      inferCuratorNotificationAction({
        action: "BAD",
        type: "PROVIDER_REGISTRATION",
        relatedEntityType: "OTHER",
      }),
    ).toBe(CURATOR_NOTIFICATION_ACTIONS.OPEN_PROVIDER);
  });

  it("infers OPEN_SCHOOL from school registration type", () => {
    expect(
      inferCuratorNotificationAction({
        action: "",
        type: "SCHOOL_REGISTRATION",
        relatedEntityType: "OTHER",
      }),
    ).toBe(CURATOR_NOTIFICATION_ACTIONS.OPEN_SCHOOL);
  });

  it("returns null when action cannot be inferred", () => {
    expect(
      inferCuratorNotificationAction({
        action: "BAD",
        type: "ADMIN_ACTION_REQUIRED",
        relatedEntityType: "OTHER",
      }),
    ).toBeNull();
  });
});
