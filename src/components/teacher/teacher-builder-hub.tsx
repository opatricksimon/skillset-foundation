"use client";

import { useSearchParams } from "next/navigation";

import { CourseBuilderStudio } from "@/components/teacher/course-builder-studio";
import { TeacherCourseStudio } from "@/components/teacher/teacher-course-studio";

export function TeacherBuilderHub() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const newCourseRequested = searchParams.get("newCourse") === "1";

  if (courseId) {
    return <CourseBuilderStudio />;
  }

  return <TeacherCourseStudio autoOpenCreate={newCourseRequested} />;
}
