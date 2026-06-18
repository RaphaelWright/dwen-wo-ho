import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { ROUTES } from "@/lib/constants/routes";
import {
  getProviderPostLoginTarget,
  syncProviderPendingUser,
} from "@/lib/utils/auth/provider-post-login-redirect";
import { mockBrowserStorage } from "@/lib/utils/shared/mock-browser-storage.test-helper";

describe("syncProviderPendingUser", () => {
  let storage: Map<string, string>;

  beforeEach(() => {
    storage = mockBrowserStorage();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stores pending user when application is pending", () => {
    const userData = {
      applicationStatus: "PENDING",
      providerName: "Dr. Test",
    };

    syncProviderPendingUser(userData, true);

    expect(storage.get("pendingUser:v1")).toBe(JSON.stringify(userData));
  });

  it("clears pending user when application is not pending", () => {
    storage.set("pendingUser:v1", JSON.stringify({ stale: true }));

    syncProviderPendingUser({ providerName: "Dr. Test" }, false);

    expect(storage.has("pendingUser:v1")).toBe(false);
  });
});

describe("getProviderPostLoginTarget", () => {
  it("redirects incomplete onboarding to signup resume step", () => {
    expect(
      getProviderPostLoginTarget(
        {
          nextStep: "phone",
          email: "user@example.com",
        },
        "fallback@example.com",
      ),
    ).toBe(
      `${ROUTES.provider.signUp}?email=${encodeURIComponent("user@example.com")}&step=bio`,
    );
  });

  it("redirects completed onboarding to provider home", () => {
    expect(
      getProviderPostLoginTarget(
        {
          nextStep: null,
          profileURL: "https://example.com/photo.jpg",
          officePhoneNumber: "0555555555",
          specialty: "Therapist",
        },
        "user@example.com",
      ),
    ).toBe(ROUTES.provider.home);
  });

  it("uses fallback email when userData email is missing", () => {
    const target = getProviderPostLoginTarget(
      { nextStep: "photo" },
      "fallback@example.com",
    );

    expect(target).toContain(encodeURIComponent("fallback@example.com"));
  });
});
