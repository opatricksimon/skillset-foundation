import { describe, expect, it } from "vitest";

import { normalizeCourseTitleKey } from "@/domain/course-title";

describe("normalizeCourseTitleKey", () => {
  it("creates the same key for titles that only differ by case, accents, and spacing", () => {
    expect(normalizeCourseTitleKey("  Mentoria XPTO  ")).toBe(
      normalizeCourseTitleKey("mentória   xpto"),
    );
  });

  it("keeps only a stable url-safe key for uniqueness checks", () => {
    expect(normalizeCourseTitleKey("Curso: Vendas & Marketing 101!")).toBe(
      "curso-vendas-marketing-101",
    );
  });
});
