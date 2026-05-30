import { describe, expect, it } from "vitest";

import {
  buildCoursePublishedProperties,
  isCoursePublishTransition,
} from "./course-analytics";

describe("isCoursePublishTransition", () => {
  it("fires when status moves into published", () => {
    expect(isCoursePublishTransition("in_review", "published")).toBe(true);
    expect(isCoursePublishTransition("draft", "published")).toBe(true);
    expect(isCoursePublishTransition(undefined, "published")).toBe(true);
  });

  it("does not fire when the course was already published", () => {
    expect(isCoursePublishTransition("published", "published")).toBe(false);
  });

  it("does not fire when the new status is not published", () => {
    expect(isCoursePublishTransition("in_review", "needs_changes")).toBe(false);
    expect(isCoursePublishTransition("published", "inactive")).toBe(false);
  });
});

describe("buildCoursePublishedProperties", () => {
  it("maps course fields onto funnel properties", () => {
    const properties = buildCoursePublishedProperties("course-1", {
      ownerId: "teacher-9",
      category: "Design",
      lessonCount: 12,
      priceAmountMinor: 4900,
      currency: "USD",
      platformFeeBps: 100,
    });

    expect(properties).toEqual({
      course_id: "course-1",
      teacher_id: "teacher-9",
      category: "Design",
      lesson_count: 12,
      price_amount_minor: 4900,
      currency: "USD",
      platform_fee_bps: 100,
    });
  });

  it("trims strings and nulls out missing or non-finite numeric fields", () => {
    const properties = buildCoursePublishedProperties("course-2", {
      ownerId: "  teacher-1  ",
      category: "   ",
      priceAmountMinor: Number.NaN,
    });

    expect(properties).toEqual({
      course_id: "course-2",
      teacher_id: "teacher-1",
      category: null,
      lesson_count: null,
      price_amount_minor: null,
      currency: null,
      platform_fee_bps: null,
    });
  });

  it("returns null when the course has no owner (refuses anonymous funnel event)", () => {
    expect(
      buildCoursePublishedProperties("course-3", { ownerId: "   " }),
    ).toBeNull();
    expect(
      buildCoursePublishedProperties("", { ownerId: "teacher-1" }),
    ).toBeNull();
  });
});
