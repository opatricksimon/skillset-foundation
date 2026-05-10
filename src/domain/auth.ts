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
