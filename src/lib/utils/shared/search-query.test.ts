import { describe, expect, it } from "vitest";
import {
  filterSchoolsBySearchQuery,
  schoolMatchesSearchQuery,
} from "./search-query";

const schools = [
  { name: "Alpha High", nickname: "AH", type: "SHS", campuses: ["Main"] },
  {
    name: "Beta College",
    nickname: "BC",
    type: "COLLEGE",
    campuses: ["North"],
  },
];

describe("filterSchoolsBySearchQuery", () => {
  it("returns all schools when query is empty", () => {
    expect(filterSchoolsBySearchQuery(schools, "")).toEqual(schools);
    expect(filterSchoolsBySearchQuery(schools, "   ")).toEqual(schools);
  });

  it("matches name, nickname, type, and campuses", () => {
    expect(filterSchoolsBySearchQuery(schools, "alpha")).toHaveLength(1);
    expect(filterSchoolsBySearchQuery(schools, "bc")).toHaveLength(1);
    expect(filterSchoolsBySearchQuery(schools, "college")).toHaveLength(1);
    expect(filterSchoolsBySearchQuery(schools, "north")).toHaveLength(1);
  });

  it("can exclude campus matching", () => {
    expect(
      schoolMatchesSearchQuery(schools[0], "main", { includeCampuses: false }),
    ).toBe(false);
    expect(
      schoolMatchesSearchQuery(schools[0], "alpha", { includeCampuses: false }),
    ).toBe(true);
  });
});
