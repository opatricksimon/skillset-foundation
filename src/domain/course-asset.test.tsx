import { describe, expect, it } from "vitest";

import { isAllowedCourseAssetFile } from "./course-asset";

function file(name: string, type: string, size = 1024) {
  return new File(["x".repeat(size)], name, { type });
}

describe("course asset validation", () => {
  it("allows common lesson material formats creators need for classes", () => {
    expect(
      isAllowedCourseAssetFile(
        file(
          "workbook.docx",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ),
        "lesson_material",
      ),
    ).toBe(true);
    expect(
      isAllowedCourseAssetFile(
        file(
          "slides.pptx",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ),
        "lesson_material",
      ),
    ).toBe(true);
    expect(
      isAllowedCourseAssetFile(file("resources.zip", "application/zip"), "lesson_material"),
    ).toBe(true);
    expect(
      isAllowedCourseAssetFile(file("audio-notes.mp3", "audio/mpeg"), "lesson_material"),
    ).toBe(true);
  });

  it("falls back to safe file extensions when browsers omit Office MIME types", () => {
    expect(isAllowedCourseAssetFile(file("worksheet.xlsx", ""), "lesson_material")).toBe(
      true,
    );
    expect(isAllowedCourseAssetFile(file("installer.exe", ""), "lesson_material")).toBe(
      false,
    );
  });
});
