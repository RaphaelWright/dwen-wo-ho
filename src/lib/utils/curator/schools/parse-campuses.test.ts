import { describe, expect, it } from "vitest";
import { parseCampuses } from "./parse-campuses";

describe("parseCampuses", () => {
  it("returns empty array for falsy input", () => {
    expect(parseCampuses(null)).toEqual([]);
    expect(parseCampuses(undefined)).toEqual([]);
    expect(parseCampuses("")).toEqual([]);
  });

  it("parses JSON string arrays", () => {
    expect(parseCampuses('["Main", "North"]')).toEqual(["Main", "North"]);
  });

  it("falls back to comma split when JSON string is invalid", () => {
    expect(parseCampuses("[invalid json")).toEqual(["[invalid json"]);
  });

  it("splits comma-separated strings and trims empty segments", () => {
    expect(parseCampuses("Main, North , ,East")).toEqual([
      "Main",
      "North",
      "East",
    ]);
  });

  it("flattens string arrays and parses nested JSON strings", () => {
    expect(parseCampuses(['["Campus A"]', "Campus B"])).toEqual([
      "Campus A",
      "Campus B",
    ]);
  });

  it("keeps non-JSON array items as-is", () => {
    expect(parseCampuses(["Alpha", "Beta"])).toEqual(["Alpha", "Beta"]);
  });

  it("returns empty array for unsupported types", () => {
    expect(parseCampuses(42)).toEqual([]);
    expect(parseCampuses({ name: "Main" })).toEqual([]);
  });
});
