import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import LearnPage from "@/app/learn/page";
import OpsPage from "@/app/ops/page";
import TeachPage from "@/app/teach/page";

const mockAuthState = vi.hoisted(() => ({
  roles: ["admin"],
}));

vi.mock("@/components/auth/auth-provider", () => ({
  useAuth: () => ({
    status: "authenticated",
    user: {
      uid: "test-user",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: null,
      roles: mockAuthState.roles,
    },
    signOut: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/platform",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/components/teacher/teacher-course-studio", () => ({
  TeacherCourseStudio: () => <div>Teacher course studio</div>,
}));

vi.mock("@/components/teacher/teacher-event-studio", () => ({
  TeacherEventStudio: () => <div>Teacher event studio</div>,
}));

vi.mock("@/components/teacher/teacher-wallet-panel", () => ({
  TeacherWalletPanel: () => <div>Teacher wallet panel</div>,
}));

vi.mock("@/components/learn/learn-dashboard", () => ({
  LearnDashboard: () => <div>Learn dashboard</div>,
}));

vi.mock("@/components/admin/course-review-queue", () => ({
  CourseReviewQueue: () => <div>Course review queue</div>,
}));

vi.mock("@/components/admin/admin-enrollment-panel", () => ({
  AdminEnrollmentPanel: () => <div>Admin enrollment panel</div>,
}));

vi.mock("@/components/admin/payment-operations-panel", () => ({
  PaymentOperationsPanel: () => <div>Payment operations panel</div>,
}));

vi.mock("@/components/admin/community-moderation-queue", () => ({
  CommunityModerationQueue: () => <div>Community moderation queue</div>,
}));

vi.mock("@/components/admin/user-lookup-panel", () => ({
  UserLookupPanel: () => <div>User lookup panel</div>,
}));

vi.mock("@/components/admin/support-ticket-queue", () => ({
  SupportTicketQueue: () => <div>Support ticket queue</div>,
}));

describe("platform shells", () => {
  it("renders the student empty state", () => {
    mockAuthState.roles = ["student"];
    render(<LearnPage />);

    expect(
      screen.getByText("A learner dashboard built for focus and continuity."),
    ).toBeInTheDocument();
  });

  it("renders the teacher publishing view", () => {
    mockAuthState.roles = ["teacher"];
    render(<TeachPage />);

    expect(
      screen.getByRole("heading", { name: "Publishing flow" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Educator support")).toBeInTheDocument();
  });

  it("renders the support and safety surface", () => {
    mockAuthState.roles = ["admin"];
    render(<OpsPage />);

    expect(screen.getByText("Learner support")).toBeInTheDocument();
  });
});
