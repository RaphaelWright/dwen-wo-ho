import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { ROUTES } from "@/lib/constants/infra/routes";
import { finalizeProviderSignInSession } from "@/lib/utils/auth/provider-sign-in-session";
import { mockBrowserStorage } from "@/lib/utils/shared/mock-browser-storage.test-helper";
import type { SignInResponse } from "@/lib/types/api/auth";

function buildSignInResponse(
  overrides: Partial<SignInResponse["userData"]> = {},
): SignInResponse {
  return {
    token: "access-token",
    refreshToken: "refresh-token",
    userData: {
      userRole: "ROLE_PROVIDER",
      providerName: "Dr. Test",
      specialty: "",
      officePhoneNumber: "",
      applicationStatus: "PENDING",
      profileURL: "",
      applicationTimestamp: "2026-01-01T00:00:00.000Z",
      title: "Dr.",
      status: "ACTIVE",
      ...overrides,
    },
  };
}

describe("finalizeProviderSignInSession", () => {
  let storage: Map<string, string>;

  beforeEach(() => {
    storage = mockBrowserStorage();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('redirects to photo step when nextStep is "photo"', () => {
    const target = finalizeProviderSignInSession(
      buildSignInResponse({ nextStep: "photo", email: "user@example.com" }),
      "fallback@example.com",
    );

    expect(target).toBe(
      `${ROUTES.provider.signUp}?email=${encodeURIComponent("user@example.com")}&step=photo`,
    );
  });

  it('redirects to bio step when nextStep is "phone"', () => {
    const target = finalizeProviderSignInSession(
      buildSignInResponse({ nextStep: "phone", email: "user@example.com" }),
      "fallback@example.com",
    );

    expect(target).toBe(
      `${ROUTES.provider.signUp}?email=${encodeURIComponent("user@example.com")}&step=bio`,
    );
  });

  it('redirects to specialty step when nextStep is "specialty"', () => {
    const target = finalizeProviderSignInSession(
      buildSignInResponse({ nextStep: "specialty", email: "user@example.com" }),
      "fallback@example.com",
    );

    expect(target).toBe(
      `${ROUTES.provider.signUp}?email=${encodeURIComponent("user@example.com")}&step=specialty`,
    );
  });

  it("redirects to provider home when nextStep is null", () => {
    const target = finalizeProviderSignInSession(
      buildSignInResponse({
        nextStep: null,
        profileURL: "https://example.com/photo.jpg",
        officePhoneNumber: "0555555555",
        specialty: "Therapist",
      }),
      "user@example.com",
    );

    expect(target).toBe(ROUTES.provider.home);
  });

  it("persists auth tokens to localStorage", () => {
    finalizeProviderSignInSession(
      buildSignInResponse({ nextStep: null }),
      "user@example.com",
    );

    expect(storage.get("token")).toBe("access-token");
    expect(storage.get("refreshToken")).toBe("refresh-token");
  });

  it("sets curatorToken when userRole is ROLE_CURATOR", () => {
    finalizeProviderSignInSession(
      buildSignInResponse({
        userRole: "ROLE_CURATOR",
        nextStep: null,
      }),
      "curator@example.com",
    );

    expect(storage.get("curatorToken")).toBe("access-token");
  });

  it("uses fallback email when userData email is missing", () => {
    const target = finalizeProviderSignInSession(
      buildSignInResponse({ nextStep: "photo" }),
      "fallback@example.com",
    );

    expect(target).toContain(encodeURIComponent("fallback@example.com"));
  });
});
