import type { UserProfile } from "@/domain/user-profile";

export type AuthPathIntent = "student" | "teacher";

export function parseAuthPathIntent(value: string | null | undefined): AuthPathIntent | null {
  if (value === "student" || value === "teacher") {
    return value;
  }

  return null;
}

export function getAuthPathIntentFromSearchParams(
  searchParams: URLSearchParams,
): AuthPathIntent | null {
  return (
    parseAuthPathIntent(searchParams.get("path")) ??
    parseAuthPathIntent(searchParams.get("role"))
  );
}

export function getAuthPathQuery(intent: AuthPathIntent | null): string {
  return intent ? `?path=${intent}` : "";
}

export function getPostAuthRoute(
  profile: UserProfile | null,
  intent: AuthPathIntent | null = null,
): string {
  if (!profile?.onboardingCompleted) {
    return `/onboarding${getAuthPathQuery(intent)}`;
  }

  if (profile.roles.includes("admin") || profile.roles.includes("support")) {
    return "/ops";
  }

  if (profile.roles.includes("teacher")) {
    return "/teach";
  }

  return "/learn";
}
