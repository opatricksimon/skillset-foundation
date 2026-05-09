import { describe, expect, it } from "vitest";

import {
  getCourseBySlug,
  getCourseSlugs,
  getFeaturedCourseCards,
  getProductSurfaces,
} from "@/lib/data/catalog";

describe("catalog data access", () => {
  it("returns stable course lookup data for static pages", () => {
    const slugs = getCourseSlugs();

    expect(slugs.length).toBeGreaterThan(0);
    expect(getCourseBySlug(slugs[0])?.slug).toBe(slugs[0]);
    expect(getCourseBySlug("missing-course")).toBeUndefined();
  });

  it("maps demo courses into public course cards", () => {
    const cards = getFeaturedCourseCards();

    expect(cards[0]).toMatchObject({
      slug: expect.any(String),
      title: expect.any(String),
      duration: expect.any(String),
      status: expect.any(String),
    });
  });

  it("keeps platform surfaces available for navigation shells", () => {
    expect(getProductSurfaces().map((surface) => surface.href)).toEqual([
      "/learn",
      "/teach",
      "/ops",
    ]);
  });
});
