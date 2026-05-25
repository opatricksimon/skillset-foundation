import {
  canOpenEnrollment,
  canSelfEnrollCourse,
  createEnrollmentSnapshot,
  getEnrollmentId,
} from "@/domain/enrollment";

describe("enrollment helpers", () => {
  it("builds a stable enrollment id", () => {
    expect(getEnrollmentId("user-1", "effective-communication")).toBe(
      "user-1__effective-communication",
    );
  });

  it("allows self-enrollment only for open learning access states", () => {
    expect(canSelfEnrollCourse("published")).toBe(true);
    expect(canSelfEnrollCourse("pilot")).toBe(true);
    expect(canSelfEnrollCourse("draft")).toBe(false);
    expect(canSelfEnrollCourse("waitlist")).toBe(false);
  });

  it("opens private course content only for usable enrollment states", () => {
    expect(canOpenEnrollment("active")).toBe(true);
    expect(canOpenEnrollment("completed")).toBe(true);
    expect(canOpenEnrollment("refunded")).toBe(false);
    expect(canOpenEnrollment("revoked")).toBe(false);
    expect(canOpenEnrollment("expired")).toBe(false);
  });

  it("creates a course snapshot for enrollment records", () => {
    const snapshot = createEnrollmentSnapshot({
      id: "course-1",
      slug: "leadership-development",
      title: "Leadership Development",
      category: "Management",
      durationLabel: "8-12 weeks",
      status: "pilot",
      statusLabel: "Pilot cohort",
      summary: "Summary",
      detail: "Detail",
      image: "https://example.com/course.jpg",
      level: "Professional",
      priceLabel: "$149 pilot access",
      priceAmountMinor: 14900,
      currency: "USD",
      platformFeeBps: 800,
      freePreviewLabel: "Free preview",
      outcomes: [],
      modules: [],
      communityEnabled: true,
    });

    expect(snapshot).toEqual({
      courseId: "course-1",
      courseSlug: "leadership-development",
      courseTitle: "Leadership Development",
      courseCategory: "Management",
      courseImage: "https://example.com/course.jpg",
    });
  });
});
