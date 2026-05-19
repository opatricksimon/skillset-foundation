import type { Role } from "@/lib/permissions";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type SkillsetUser = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  roles: Role[];
};

export type AuthSession = {
  status: AuthStatus;
  user: SkillsetUser | null;
};

export type EmailPasswordCredentials = {
  email: string;
  password: string;
};

export type SignupInput = EmailPasswordCredentials & {
  displayName: string;
};

/**
 * Single human-readable label for a user's highest-priority role.
 * Shared by SessionCard (sidebar) and AccountMenu (top bar) so the same
 * person never sees two different words for the same role.
 */
export function formatPrimaryRole(roles: readonly Role[]): string {
  if (roles.includes("admin")) return "Admin";
  if (roles.includes("support")) return "Support";
  if (roles.includes("teacher")) return "Creator";
  if (roles.includes("student")) return "Learner";
  return "Member";
}
