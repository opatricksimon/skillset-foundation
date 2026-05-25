import { describe, expect, it } from "vitest";

import { getCourseAccessDecision } from "@/domain/course-access";
import type { Course } from "@/domain/learning";

const baseCourse: Course = {
  id: "course-test",
  slug: "test-course",
  title: "Test Course",
  category: "Management",
  durationLabel: "4 weeks",
  status: "published",
  statusLabel: "Published",
  summary: "A test course.",
  detail: "A test course detail.",
  image: "/test.jpg",
  level: "Foundation",
  priceLabel: "Free",
  priceAmountMinor: 0,
  currency: "USD",
  platformFeeBps: 800,
  freePreviewLabel: "Preview",
  outcomes: [],
  modules: [],
  communityEnabled: true,
};

describe("course access decisions", () => {
  it("allows only free courses to self-enroll directly", () => {
    expect(getCourseAccessDecision(baseCourse, false).mode).toBe("free_enrollment");
  });

  it("blocks paid courses while checkout is disabled", () => {
    expect(
      getCourseAccessDecision(
        {
          ...baseCourse,
          priceAmountMinor: 4900,
          priceLabel: "$49",
        },
        false,
      ).mode,
    ).toBe("paid_checkout_disabled");
  });

  it("keeps pre-launch courses closed even when free", () => {
    expect(
      getCourseAccessDecision(
        {
          ...baseCourse,
          status: "opening_soon",
          statusLabel: "Opening soon",
        },
        false,
      ).mode,
    ).toBe("not_open");
  });
});
