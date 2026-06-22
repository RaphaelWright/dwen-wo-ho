import { describe, expect, it } from "vitest";
import { ROUTES } from "@/lib/constants/infra/routes";
import type { RedirectInfo } from "@/lib/types/auth/redirect";
import {
  buildProviderAuthRedirectTarget,
  getProviderProfileResumeStep,
  mapBackendNextStepToSlug,
  resolveProviderProfileResumeStep,
} from "@/lib/utils/provider/signup-resume";

describe("mapBackendNextStepToSlug", () => {
  it('maps "photo" to photo', () => {
    expect(mapBackendNextStepToSlug("photo")).toBe("photo");
  });

  it('maps "phone" to bio', () => {
    expect(mapBackendNextStepToSlug("phone")).toBe("bio");
  });

  it('maps "specialty" to specialty', () => {
    expect(mapBackendNextStepToSlug("specialty")).toBe("specialty");
  });

  it("maps null to null", () => {
    expect(mapBackendNextStepToSlug(null)).toBeNull();
  });

  it("returns null for unknown values", () => {
    expect(mapBackendNextStepToSlug("unknown")).toBeNull();
  });
});

describe("resolveProviderProfileResumeStep", () => {
  it("returns null when nextStep is null", () => {
    expect(
      resolveProviderProfileResumeStep({
        nextStep: null,
        profileURL: "",
      }),
    ).toBeNull();
  });

  it('returns photo when nextStep is "photo"', () => {
    expect(
      resolveProviderProfileResumeStep({
        nextStep: "photo",
        profileURL: "https://example.com/photo.jpg",
        officePhoneNumber: "0555555555",
        specialty: "Therapist",
      }),
    ).toBe("photo");
  });

  it('returns bio when nextStep is "phone"', () => {
    expect(
      resolveProviderProfileResumeStep({
        nextStep: "phone",
      }),
    ).toBe("bio");
  });

  it('returns specialty when nextStep is "specialty"', () => {
    expect(
      resolveProviderProfileResumeStep({
        nextStep: "specialty",
        profileURL: "",
      }),
    ).toBe("specialty");
  });

  it("falls back to field inference when nextStep is undefined and photo is missing", () => {
    expect(
      resolveProviderProfileResumeStep({
        profileURL: "",
      }),
    ).toBe("photo");
  });

  it("falls back to bio when nextStep is undefined, photo present, no phone", () => {
    expect(
      resolveProviderProfileResumeStep({
        profileURL: "https://example.com/photo.jpg",
        officePhoneNumber: "",
      }),
    ).toBe("bio");
  });

  it("prefers explicit nextStep over populated fields", () => {
    expect(
      resolveProviderProfileResumeStep({
        nextStep: "specialty",
        profileURL: "https://example.com/photo.jpg",
        officePhoneNumber: "0555555555",
        specialty: "Therapist",
      }),
    ).toBe("specialty");
  });

  it("falls back when nextStep is an unknown string", () => {
    expect(
      resolveProviderProfileResumeStep({
        nextStep: "unknown" as "photo",
        profileURL: "",
      }),
    ).toBe(getProviderProfileResumeStep({ profileURL: "" }));
  });
});

describe("buildProviderAuthRedirectTarget", () => {
  it("returns path only when step is absent", () => {
    const redirectInfo: RedirectInfo = {
      path: ROUTES.provider.home,
      isPending: false,
    };

    expect(
      buildProviderAuthRedirectTarget(redirectInfo, "user@example.com"),
    ).toBe(ROUTES.provider.home);
  });

  it("appends email and step query params when step is set", () => {
    const redirectInfo: RedirectInfo = {
      path: ROUTES.provider.signUp,
      step: "bio",
      isPending: false,
    };

    expect(
      buildProviderAuthRedirectTarget(redirectInfo, "user@example.com"),
    ).toBe(
      `${ROUTES.provider.signUp}?email=${encodeURIComponent("user@example.com")}&step=bio`,
    );
  });
});
