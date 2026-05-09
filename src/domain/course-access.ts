import type { Course } from "@/domain/learning";
import { canSelfEnrollCourse } from "@/domain/enrollment";

export type CourseAccessDecision =
  | {
      mode: "not_open";
      title: string;
      detail: string;
    }
  | {
      mode: "free_enrollment";
      title: string;
      detail: string;
    }
  | {
      mode: "paid_checkout_disabled";
      title: string;
      detail: string;
    }
  | {
      mode: "paid_checkout_required";
      title: string;
      detail: string;
    };

export function getCourseAccessDecision(
  course: Course,
  checkoutEnabled: boolean,
): CourseAccessDecision {
  if (!canSelfEnrollCourse(course.status)) {
    return {
      mode: "not_open",
      title: "Enrollment not open yet",
      detail: "This course is not open for enrollment yet. Public access opens after approval and launch setup.",
    };
  }

  if (course.priceAmountMinor === 0) {
    return {
      mode: "free_enrollment",
      title: "Add to My Learning",
      detail: "This free course can be added to your learner workspace.",
    };
  }

  if (typeof course.priceAmountMinor === "number" && course.priceAmountMinor > 0) {
    if (checkoutEnabled) {
      return {
        mode: "paid_checkout_required",
        title: "Secure checkout required",
        detail: "Paid access must be activated through server-confirmed checkout before course content opens.",
      };
    }

    return {
      mode: "paid_checkout_disabled",
      title: "Checkout opening soon",
      detail: "Paid course access is locked until secure checkout is connected. Free preview remains available.",
    };
  }

  return {
    mode: "not_open",
    title: "Enrollment not open yet",
    detail: "Pricing and access for this course are still being prepared.",
  };
}
