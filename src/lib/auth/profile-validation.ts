import type { UserGoal } from "@/domain/user-profile";
import { userGoalOptions } from "@/domain/user-profile";

const usernamePattern = /^[a-z0-9][a-z0-9-]{2,31}$/;
const userGoalSet = new Set<UserGoal>(userGoalOptions);

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/^@+/, "");
}

export function validateUsername(value: string) {
  const normalized = normalizeUsername(value);

  if (!normalized) {
    return "Choose a username for your Skillset identity.";
  }

  if (!usernamePattern.test(normalized)) {
    return "Use 3-32 lowercase letters, numbers, or hyphens. Start with a letter or number.";
  }

  return "";
}

export function validateDisplayName(value: string) {
  const trimmed = value.trim();

  if (trimmed.length < 2) {
    return "Enter the name people should see on Skillset.";
  }

  if (trimmed.length > 120) {
    return "Keep your display name under 120 characters.";
  }

  return "";
}

export function validateBio(value: string) {
  if (value.trim().length > 280) {
    return "Keep your bio under 280 characters.";
  }

  return "";
}

export function normalizeGoals(values: string[]): UserGoal[] {
  return values.filter((value): value is UserGoal => userGoalSet.has(value as UserGoal));
}

