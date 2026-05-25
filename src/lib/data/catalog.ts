import { demoCourses } from "@/data/demo/courses";
import { demoCommunitySpaces, demoLiveEvents, demoProductSurfaces } from "@/data/demo/platform";
import type { Course } from "@/domain/learning";

export type CourseCard = {
  slug: string;
  title: string;
  category: string;
  duration: string;
  status: string;
  summary: string;
  image: string;
  detail: string;
  priceLabel: string;
  freePreviewLabel: string;
  hasPaidAccess: boolean;
  href?: string;
  freePreviewHref?: string;
  sourceLabel?: string;
  ratingLabel?: string;
};

export function getCourses(): Course[] {
  return demoCourses;
}

export function getCourseBySlug(slug: string): Course | undefined {
  return demoCourses.find((course) => course.slug === slug);
}

export function getCourseSlugs(): string[] {
  return demoCourses.map((course) => course.slug);
}

export function getFeaturedCourseCards(): CourseCard[] {
  return demoCourses.map((course) => ({
    slug: course.slug,
    title: course.title,
    category: course.category,
    duration: course.durationLabel,
    status: course.statusLabel,
    summary: course.summary,
    image: course.image,
    detail: course.detail,
    priceLabel: course.priceLabel,
    freePreviewLabel: course.freePreviewLabel,
    hasPaidAccess: course.priceAmountMinor !== null,
  }));
}

export function getProductSurfaces() {
  return demoProductSurfaces;
}

export function getCommunitySpaces() {
  return demoCommunitySpaces;
}

export function getLiveEvents() {
  return demoLiveEvents;
}
