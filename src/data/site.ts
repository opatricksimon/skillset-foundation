import { getFeaturedCourseCards, getProductSurfaces } from "@/lib/data/catalog";
import type { Permission } from "@/lib/permissions";

export type Track = {
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
};

export type Surface = {
  title: string;
  href: string;
  label: string;
  summary: string;
};

export type PlatformNavContext = "learner" | "teacher" | "ops";

export type PlatformNavItem = {
  href: string;
  label: string;
  shortLabel: string;
  /** Which workspace context(s) this item belongs to. */
  contexts: readonly PlatformNavContext[];
  /** Items sharing a group render together; a divider is drawn between groups. */
  group: number;
  permission?: Permission;
};

export const featuredTracks: Track[] = getFeaturedCourseCards();

export const productSurfaces: Surface[] = getProductSurfaces().map(
  ({ title, href, label, summary }) => ({ title, href, label, summary }),
);

export const marketplaceHighlights = [
  "Professional programs across leadership, psychology, health, and management",
  "Experienced instructors with practical and academic credibility",
  "A learning experience shaped for clarity, support, and momentum",
  "Designed for international learners and educators",
];

// One compact list per workspace context. The learner <-> teacher switch
// lives in the top-right account menu, so the sidebar never stacks both at
// once. Groups draw a subtle divider between them; account/help links are
// intentionally omitted here because they live in the account menu.
export const platformNav: PlatformNavItem[] = [
  {
    href: "/platform",
    label: "Home",
    shortLabel: "H",
    contexts: ["learner", "ops"],
    group: 0,
  },
  {
    href: "/courses",
    label: "Marketplace",
    shortLabel: "M",
    contexts: ["learner", "teacher", "ops"],
    group: 0,
  },
  {
    href: "/teach",
    label: "Teacher Studio",
    shortLabel: "T",
    contexts: ["teacher"],
    group: 0,
    permission: "teacherStudio.access",
  },
  {
    href: "/learn",
    label: "Classroom",
    shortLabel: "C",
    contexts: ["learner"],
    group: 1,
    permission: "courses.viewLearning",
  },
  {
    href: "/learn/community",
    label: "Community",
    shortLabel: "Co",
    contexts: ["learner"],
    group: 1,
    permission: "community.read",
  },
  {
    href: "/learn/events",
    label: "Calendar",
    shortLabel: "Ca",
    contexts: ["learner"],
    group: 1,
    permission: "courses.viewLearning",
  },
  {
    href: "/learn/credentials",
    label: "Credentials",
    shortLabel: "Cr",
    contexts: ["learner"],
    group: 1,
    permission: "certificates.view",
  },
  {
    href: "/teach/builder",
    label: "Course Builder",
    shortLabel: "B",
    contexts: ["teacher"],
    group: 1,
    permission: "teacherStudio.manageCourses",
  },
  {
    href: "/teach/media",
    label: "Media Library",
    shortLabel: "Me",
    contexts: ["teacher"],
    group: 1,
    permission: "teacherStudio.manageCourses",
  },
  {
    href: "/teach/coupons",
    label: "Coupons",
    shortLabel: "Cu",
    contexts: ["teacher"],
    group: 1,
    permission: "teacherStudio.manageCourses",
  },
  {
    href: "/teach/integrations",
    label: "Integrations",
    shortLabel: "In",
    contexts: ["teacher"],
    group: 2,
    permission: "teacherStudio.access",
  },
  {
    href: "/teach/refunds",
    label: "Refunds",
    shortLabel: "R",
    contexts: ["teacher"],
    group: 2,
    permission: "teacherStudio.access",
  },
  {
    href: "/teach/team",
    label: "Team",
    shortLabel: "Te",
    contexts: ["teacher"],
    group: 2,
    permission: "teacherStudio.access",
  },
  {
    href: "/ops",
    label: "Operations",
    shortLabel: "O",
    contexts: ["ops"],
    group: 1,
    permission: "platform.accessAdmin",
  },
];
