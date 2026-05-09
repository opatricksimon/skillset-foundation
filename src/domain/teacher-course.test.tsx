import { describe, expect, it } from "vitest";

import {
  countCourseLessons,
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
  });
});
