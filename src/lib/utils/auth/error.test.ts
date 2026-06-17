import { describe, expect, it } from "vitest";
import { getCleanErrorMessage } from "./error";

describe("getCleanErrorMessage", () => {
  it.each([
    { input: undefined, expected: "An unexpected error occurred." },
    { input: null, expected: "An unexpected error occurred." },
    { input: "Invalid credentials", expected: "Invalid credentials" },
    { input: new Error("Network failed"), expected: "Network failed" },
    {
      input: {
        message: "Fallback message",
        response: { data: { message: "API message wins" } },
      },
      expected: "API message wins",
    },
    {
      input: { message: '{"message":"Parsed msg"}' },
      expected: "Parsed msg",
    },
    {
      input: { message: '{"error":"Err key"}' },
      expected: "Err key",
    },
    {
      input: { message: '{"invalid":true}' },
      expected: '{"invalid":true}',
    },
    {
      input: { message: '{"broken' },
      expected: '{"broken',
    },
  ])("returns $expected for input shape", ({ input, expected }) => {
    expect(getCleanErrorMessage(input)).toBe(expected);
  });
});
