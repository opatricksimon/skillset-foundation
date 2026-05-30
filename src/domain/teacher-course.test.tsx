import { describe, expect, it } from "vitest";

import {
  countCourseLessons,
  normalizeCourseCategories,
  normalizeInstallmentsMax,
  normalizeTeacherCourseModules,
  teacherCanDeleteCourse,
  teacherCanEditCourse,
  teacherCanSubmitCourse,
  type TeacherCourseModule,
} from "./teacher-course";

describe("teacher course domain", () => {
  it("counts lessons across modules", () => {
    const modules: TeacherCourseModule[] = [
      {
        id: "module-1",
        title: "Foundation",
        lessons: [
          { id: "lesson-1", title: "Welcome", type: "video", description: "" },
          { id: "lesson-2", title: "Core idea", type: "text", description: "" },
        ],
      },
      {
        id: "module-2",
        title: "Practice",
        lessons: [
          { id: "lesson-3", title: "Reflection", type: "assignment", description: "" },
        ],
      },
    ];

    expect(countCourseLessons(modules)).toBe(3);
  });

  it("models the lightweight review workflow", () => {
    expect(teacherCanEditCourse("draft")).toBe(true);
    expect(teacherCanEditCourse("needs_changes")).toBe(true);
    expect(teacherCanEditCourse("published")).toBe(true);
    expect(teacherCanEditCourse("in_review")).toBe(false);

    expect(teacherCanSubmitCourse("draft")).toBe(true);
    expect(teacherCanSubmitCourse("needs_changes")).toBe(true);
    expect(teacherCanSubmitCourse("inactive")).toBe(true);
    expect(teacherCanSubmitCourse("published")).toBe(false);

    expect(teacherCanDeleteCourse("draft")).toBe(true);
    expect(teacherCanDeleteCourse("needs_changes")).toBe(true);
    expect(teacherCanDeleteCourse("in_review")).toBe(false);
    expect(teacherCanDeleteCourse("published")).toBe(false);
    expect(teacherCanDeleteCourse("inactive")).toBe(false);
  });

  it("normalizes installment limits for one-time courses", () => {
    expect(normalizeInstallmentsMax(12)).toBe(12);
    expect(normalizeInstallmentsMax(40)).toBe(36);
    expect(normalizeInstallmentsMax(0)).toBe(1);
    expect(normalizeInstallmentsMax(null)).toBeNull();
  });

  it("deduplicates selected course categories", () => {
    expect(
      normalizeCourseCategories([
        "Marketing and sales",
        " marketing and sales ",
        "Technology and software",
        "",
      ]),
    ).toEqual(["Marketing and sales", "Technology and software"]);
  });

  it("normalizes modules, lessons, module copy, and lesson media references", () => {
    expect(
      normalizeTeacherCourseModules([
        {
          id: "module-1",
          title: " Foundations ",
          summary: "  Start here  ",
          coverAssetId: undefined,
          lessons: [
            {
              id: "lesson-1",
              title: " Intro ",
              type: "video",
              description: "  Watch first  ",
              durationMinutes: undefined,
              contentText: "  Notes  ",
              externalUrl: "  https://youtu.be/dQw4w9WgXcQ  ",
              dripDelayDays: 2.6,
              thumbnailAssetId: undefined,
            },
          ],
        },
      ]),
    ).toEqual([
      {
        id: "module-1",
        title: "Foundations",
        summary: "Start here",
        coverAssetId: null,
        lessons: [
          {
            id: "lesson-1",
            title: "Intro",
            type: "video",
            description: "Watch first",
            durationMinutes: null,
            contentText: "Notes",
            externalUrl: "https://youtu.be/dQw4w9WgXcQ",
            dripDelayDays: 3,
            thumbnailAssetId: null,
          },
        ],
      },
    ]);
  });
});
