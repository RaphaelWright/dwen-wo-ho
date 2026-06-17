import { describe, expect, it } from "vitest";
import {
  calculateTimeAgo,
  compactTimeAgo,
  formatElapsedSeconds,
  timeAgo,
  verboseTimeAgo,
} from "./time-ago";

describe("formatElapsedSeconds", () => {
  it("formats seconds as mm:ss", () => {
    expect(formatElapsedSeconds(0)).toBe("0:00");
    expect(formatElapsedSeconds(65)).toBe("1:05");
    expect(formatElapsedSeconds(125)).toBe("2:05");
  });
});

describe("timeAgo", () => {
  it("returns empty string for undefined", () => {
    expect(timeAgo(undefined)).toBe("");
  });

  it("returns just now for recent timestamps", () => {
    const now = new Date().toISOString();
    expect(timeAgo(now)).toBe("just now");
  });
});

describe("compactTimeAgo", () => {
  it("returns empty string for empty input", () => {
    expect(compactTimeAgo("")).toBe("");
  });

  it("returns compact units", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(compactTimeAgo(twoHoursAgo)).toBe("2h");
  });
});

describe("calculateTimeAgo", () => {
  it("caps at days with ago suffix", () => {
    const twoDaysAgo = new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000,
    ).toISOString();
    expect(calculateTimeAgo(twoDaysAgo)).toBe("2d ago");
  });
});

describe("verboseTimeAgo", () => {
  it("uses full words and title case for just now", () => {
    const now = new Date().toISOString();
    expect(verboseTimeAgo(now)).toBe("Just now");
  });

  it("pluralizes minutes correctly", () => {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    expect(verboseTimeAgo(twoMinutesAgo)).toBe("2 minutes ago");
  });
});
