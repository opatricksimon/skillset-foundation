import { describe, expect, it } from "vitest";

import {
  MAX_LEARNING_OUTCOMES,
  MAX_LEARNING_OUTCOME_LENGTH,
  normalizeLearningOutcomes,
} from "@/domain/teacher-course";

describe("normalizeLearningOutcomes", () => {
  it("trims entries and drops blank ones while preserving order", () => {
    expect(
      normalizeLearningOutcomes([
        "  Launch a paid cohort  ",
        "",
        "   ",
        "Run live Q&A sessions",
      ]),
    ).toEqual(["Launch a paid cohort", "Run live Q&A sessions"]);
  });

  it("ignores non-array input and non-string members", () => {
    expect(normalizeLearningOutcomes(undefined)).toEqual([]);
    expect(normalizeLearningOutcomes(null)).toEqual([]);
    expect(normalizeLearningOutcomes("not an array")).toEqual([]);
    expect(
      normalizeLearningOutcomes([42, { text: "x" }, null, "Keep this one"]),
    ).toEqual(["Keep this one"]);
  });

  it("caps each outcome length and the total count", () => {
    const long = "a".repeat(MAX_LEARNING_OUTCOME_LENGTH + 50);
    const many = Array.from(
      { length: MAX_LEARNING_OUTCOMES + 5 },
      (_, index) => `Outcome ${index + 1}`,
    );

    expect(normalizeLearningOutcomes([long])[0]).toHaveLength(
      MAX_LEARNING_OUTCOME_LENGTH,
    );
    expect(normalizeLearningOutcomes(many)).toHaveLength(MAX_LEARNING_OUTCOMES);
  });
});
