import type { Role } from "@/lib/permissions";

export const userGoalOptions = [
  "career_growth",
  "skill_certification",
  "teach_online",
  "build_community",
  "live_mentorship",
  "business_training",
] as const;

export type UserGoal = (typeof userGoalOptions)[number];

export type OnboardingPath = "student" | "teacher" | "both";

export type OnboardingAnswers = {
  path?: OnboardingPath;
  sourceOfDiscovery?: string;
  alreadySold?: "yes" | "no";
  monthlyRevenue?: string;
  primaryGoal?: string[];
  instagramHandle?: string;
  audienceSize?: string;
};

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  username?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  timezone?: string | null;
  goals?: UserGoal[];
  photoURL: string | null;
  roles: Role[];
  onboardingCompleted: boolean;
  onboardingAnswers?: OnboardingAnswers;
  onboardingPath?: OnboardingPath;
  onboardingCompletedAt?: unknown;
  termsAcceptedAt?: string;
  termsVersion?: string;
  privacyAcceptedAt?: unknown;
  privacyVersion?: string;
  teacherTermsAcceptedAt?: unknown;
  teacherTermsVersion?: string;
  marketingConsent?: boolean;
  stripeConnectedAccountId?: string | null;
  stripeConnectStatus?: "created" | "onboarding_required" | "ready" | null;
  stripeConnectChargesEnabled?: boolean;
  stripeConnectPayoutsEnabled?: boolean;
  stripeConnectUpdatedAt?: unknown;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
};

export type UpsertUserProfileInput = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export type UserIdentityInput = {
  displayName?: string | null;
  username?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  timezone?: string | null;
  goals?: UserGoal[];
};

export type UpdateOnboardingAnswersInput = {
  uid: string;
  answers: OnboardingAnswers;
  path?: OnboardingPath;
  completed?: boolean;
};
