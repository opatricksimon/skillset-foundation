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
  /** Lucide icon key — resolved to a component in platform-nav.tsx. */
  icon: string;
  /** Which workspace context(s) this item belongs to. */
  contexts: readonly PlatformNavContext[];
  /** Section label; an uppercase header is drawn when the section changes. */
  section: string;
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
  // --- Learner workspace ---
  {
    href: "/learn",
    label: "Classroom",
    icon: "BookOpen",
    contexts: ["learner"],
    section: "Learn",
    permission: "courses.viewLearning",
  },
  {
    href: "/learn/community",
    label: "Community",
    icon: "Users",
    contexts: ["learner"],
    section: "Learn",
    permission: "community.read",
  },
  {
    href: "/learn/events",
    label: "Calendar",
    icon: "Calendar",
    contexts: ["learner"],
    section: "Learn",
    permission: "courses.viewLearning",
  },
  {
    href: "/learn/credentials",
    label: "Credentials",
    icon: "Award",
    contexts: ["learner"],
    section: "Learn",
    permission: "certificates.view",
  },
  // --- Teacher workspace ---
  {
    href: "/teach",
    label: "Dashboard",
    icon: "LayoutDashboard",
    contexts: ["teacher"],
    section: "Studio",
    permission: "teacherStudio.access",
  },
  {
    href: "/teach/builder",
    label: "Courses",
    icon: "BookOpen",
    contexts: ["teacher"],
    section: "Studio",
    permission: "teacherStudio.manageCourses",
  },
  {
    href: "/teach/media",
    label: "Media Library",
    icon: "Image",
    contexts: ["teacher"],
    section: "Studio",
    permission: "teacherStudio.manageCourses",
  },
  {
    href: "/teach/coupons",
    label: "Coupons",
    icon: "Tag",
    contexts: ["teacher"],
    section: "Studio",
    permission: "teacherStudio.manageCourses",
  },
  {
    href: "/teach/co-productions",
    label: "Co-productions",
    icon: "Users",
    contexts: ["teacher"],
    section: "Growth",
    permission: "teacherStudio.access",
  },
  {
    href: "/teach/refunds",
    label: "Refunds",
    icon: "RefreshCw",
    contexts: ["teacher"],
    section: "Growth",
    permission: "teacherStudio.access",
  },
  {
    href: "/teach/team",
    label: "Team",
    icon: "UserCheck",
    contexts: ["teacher"],
    section: "Setup",
    permission: "teacherStudio.access",
  },
  {
    href: "/teach/integrations",
    label: "Integrations",
    icon: "Plug",
    contexts: ["teacher"],
    section: "Setup",
    permission: "teacherStudio.access",
  },
  // --- Operations workspace ---
  {
    href: "/ops",
    label: "Operations",
    icon: "Settings",
    contexts: ["ops"],
    section: "Operations",
    permission: "platform.accessAdmin",
  },
  // --- Shared across every workspace ---
  {
    href: "/courses",
    label: "Marketplace",
    icon: "ShoppingBag",
    contexts: ["learner", "teacher", "ops"],
    section: "Discover",
  },
  {
    href: "/account",
    label: "Settings",
    icon: "Settings",
    contexts: ["learner", "teacher", "ops"],
    section: "Account",
  },
  {
    href: "/account/billing",
    label: "Billing",
    icon: "CreditCard",
    contexts: ["learner", "teacher", "ops"],
    section: "Account",
  },
];
