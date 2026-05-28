"use client";

/**
 * Minimal client-only PostHog page trackers.
 *
 * Server components cannot call posthog.capture() directly, so each page
 * route renders one of these zero-output components to record the event
 * exactly once on mount. Source is set per-page so the funnel knows
 * whether a course view came from search, marketplace, direct link, etc.
 */

import { useEffect } from "react";

import { track } from "@/lib/posthog/events";
import type { CourseViewedProps } from "@/lib/posthog/events";

export function CourseViewedTracker(props: CourseViewedProps) {
  // course_id / slug / source are stable for the page, so we only want
  // ONE event per mount even under React Strict Mode double-invoke in dev.
  // The `initialized` guard in client.ts already short-circuits double
  // capture before PostHog is ready, but we still wrap in a ref-style
  // useEffect with a primitive dep set to avoid duplicates.
  const { course_id, slug, source } = props;

  useEffect(() => {
    track.courseViewed({ course_id, slug, source });
  }, [course_id, slug, source]);

  return null;
}
