import { describe, expect, it } from "vitest";

import {
  createWishlistItem,
  getWishlistId,
  sortWishlistItems,
} from "@/domain/wishlist";

describe("wishlist domain", () => {
  it("uses a stable user/course document id", () => {
    expect(getWishlistId("user_123", "course_456")).toBe(
      "user_123__course_456",
    );
  });

  it("creates the minimal persisted wishlist item", () => {
    expect(
      createWishlistItem({
        userId: "user_123",
        courseId: "course_456",
        courseSlug: "course-456",
      }),
    ).toEqual({
      id: "user_123__course_456",
      userId: "user_123",
      courseId: "course_456",
      courseSlug: "course-456",
    });
  });

  it("sorts items without mutating the source list", () => {
    const items = [
      createWishlistItem({
        userId: "user_123",
        courseId: "b",
        courseSlug: "beta",
      }),
      createWishlistItem({
        userId: "user_123",
        courseId: "a",
        courseSlug: "alpha",
      }),
    ];

    expect(sortWishlistItems(items).map((item) => item.courseSlug)).toEqual([
      "alpha",
      "beta",
    ]);
    expect(items.map((item) => item.courseSlug)).toEqual(["beta", "alpha"]);
  });
});
