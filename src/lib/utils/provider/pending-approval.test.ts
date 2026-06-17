import { describe, expect, it } from "vitest";
import { toPendingApprovalUserInfo } from "./pending-approval";

describe("toPendingApprovalUserInfo", () => {
  it("uses title and name when both are present", () => {
    const result = toPendingApprovalUserInfo({
      title: "Dr.",
      name: "Ada Lovelace",
      specialty: "Psychiatry",
      memberSince: "2024-01-15T00:00:00.000Z",
    });

    expect(result.name).toBe("Dr. Ada Lovelace");
    expect(result.title).toBe("Psychiatry");
    expect(result.specialty).toBe("Psychiatry");
    expect(result.timeAgo).not.toBe("Recently");
  });

  it("falls back to professionalTitle and providerName", () => {
    const result = toPendingApprovalUserInfo({
      professionalTitle: "Prof.",
      providerName: "Grace Hopper",
      applicationDate: "2024-06-01T00:00:00.000Z",
    });

    expect(result.name).toBe("Prof. Grace Hopper");
    expect(result.timeAgo).not.toBe("Recently");
  });

  it("returns defaults when profile is missing", () => {
    const result = toPendingApprovalUserInfo();

    expect(result).toEqual({
      name: "",
      title: "",
      specialty: "",
      profileImage: undefined,
      timeAgo: "Recently",
    });
  });

  it("prefers avatarUrl over profilePhotoURL", () => {
    const result = toPendingApprovalUserInfo({
      name: "Test Provider",
      avatarUrl: "https://example.com/avatar.png",
      profilePhotoURL: "https://example.com/legacy.png",
    });

    expect(result.profileImage).toBe("https://example.com/avatar.png");
  });
});
