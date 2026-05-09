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

export type PlatformNavItem = {
  href: string;
  label: string;
  shortLabel: string;
  section: "Discover" | "Learn" | "Teach" | "Account" | "Ops";
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

export const platformNav: PlatformNavItem[] = [
  { href: "/platform", label: "Home", shortLabel: "H", section: "Discover" },
  { href: "/courses", label: "Marketplace", shortLabel: "M", section: "Discover" },
  {
    href: "/learn",
    label: "Classroom",
    shortLabel: "C",
    section: "Learn",
    permission: "courses.viewLearning",
  },
  {
    href: "/learn/community",
    label: "Community",
    shortLabel: "Co",
    section: "Learn",
    permission: "community.read",
  },
  {
    href: "/learn/events",
    label: "Calendar",
    shortLabel: "Ca",
    section: "Learn",
    permission: "courses.viewLearning",
  },
  {
    href: "/learn/credentials",
    label: "Credentials",
    shortLabel: "Cr",
    section: "Learn",
    permission: "certificates.view",
  },
  {
    href: "/teach",
    label: "Teacher Studio",
    shortLabel: "T",
    section: "Teach",
    permission: "teacherStudio.access",
  },
  {
    href: "/teach/builder",
    label: "Course Builder",
    shortLabel: "B",
    section: "Teach",
    permission: "teacherStudio.manageCourses",
  },
  {
    href: "/teach/media",
    label: "Media Library",
    shortLabel: "Me",
    section: "Teach",
    permission: "teacherStudio.manageCourses",
  },
  {
    href: "/learn/settings",
    label: "Profile Settings",
    shortLabel: "S",
    section: "Account",
    permission: "auth.signOut",
  },
  {
    href: "/support",
    label: "Support",
    shortLabel: "Su",
    section: "Account",
    permission: "auth.signOut",
  },
  {
    href: "/ops",
    label: "Operations",
    shortLabel: "O",
    section: "Ops",
    permission: "platform.accessAdmin",
  },
];
