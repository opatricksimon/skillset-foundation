"use client";

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  verifyBeforeUpdateEmail,
  type User,
} from "firebase/auth";

import type {
  AuthSession,
  EmailPasswordCredentials,
  SignupInput,
  SkillsetUser,
} from "@/domain/auth";
import type { UserProfile } from "@/domain/user-profile";
import { getUserProfile, upsertUserProfile } from "@/lib/data/user-profiles";
import { getFirebaseAuth } from "@/lib/firebase/client";

export function mapFirebaseUser(
  user: User,
  profile?: UserProfile | null,
): SkillsetUser {
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: profile?.displayName ?? user.displayName,
    photoURL: profile?.photoURL ?? user.photoURL,
    roles: profile?.roles ?? ["student"],
  };
}

export function listenToAuthState(callback: (session: AuthSession) => void) {
  const auth = getFirebaseAuth();

  callback({ status: "loading", user: null });

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      await upsertUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      const profile = await getUserProfile(user.uid);

      callback({
        status: "authenticated",
        user: mapFirebaseUser(user, profile),
      });

      return;
    }

    callback({
      status: "unauthenticated",
      user: null,
    });
  });
}

export async function signInWithEmail({ email, password }: EmailPasswordCredentials) {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await upsertUserProfile({
    uid: credential.user.uid,
    email: credential.user.email,
    displayName: credential.user.displayName,
    photoURL: credential.user.photoURL,
  });

  return mapFirebaseUser(credential.user);
}

export async function signUpWithEmail({
  displayName,
  email,
  password,
}: SignupInput) {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }

  await upsertUserProfile({
    uid: credential.user.uid,
    email: credential.user.email,
    displayName: displayName.trim() || credential.user.displayName,
    photoURL: credential.user.photoURL,
  });
  await sendEmailVerification(credential.user).catch(() => undefined);

  return mapFirebaseUser(credential.user);
}

export async function signInWithGoogle() {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  await upsertUserProfile({
    uid: credential.user.uid,
    email: credential.user.email,
    displayName: credential.user.displayName,
    photoURL: credential.user.photoURL,
  });

  return mapFirebaseUser(credential.user);
}

export async function resetPassword(email: string) {
  const auth = getFirebaseAuth();

  await sendPasswordResetEmail(auth, email);
}

export async function sendSkillsetEmailVerification() {
  const user = getFirebaseAuth().currentUser;

  if (!user) {
    throw new Error("No authenticated user.");
  }

  await sendEmailVerification(user);
}

export async function refreshCurrentUserEmailVerification() {
  const user = getFirebaseAuth().currentUser;

  if (!user) {
    return false;
  }

  await reload(user);
  await user.getIdToken(true);

  return user.emailVerified;
}

export async function requestSkillsetEmailChange(newEmail: string) {
  const user = getFirebaseAuth().currentUser;
  const normalizedEmail = newEmail.trim().toLowerCase();

  if (!user) {
    throw new Error("No authenticated user.");
  }

  if (!normalizedEmail || normalizedEmail === user.email?.toLowerCase()) {
    throw new Error("Use a different valid email address.");
  }

  await verifyBeforeUpdateEmail(user, normalizedEmail);
}

export async function signOutOfSkillset() {
  await signOut(getFirebaseAuth());
}

export function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  if (code.includes("auth/invalid-email")) {
    return "Enter a valid email address.";
  }

  if (code.includes("auth/missing-email")) {
    return "Enter your email address.";
  }

  if (code.includes("auth/missing-password")) {
    return "Enter your password.";
  }

  if (code.includes("auth/invalid-credential")) {
    return "The email or password is incorrect.";
  }

  if (code.includes("auth/user-disabled")) {
    return "This account has been disabled. Contact support.";
  }

  if (code.includes("auth/email-already-in-use")) {
    return "An account already exists with this email.";
  }

  if (code.includes("auth/weak-password")) {
    return "Use a stronger password with at least 8 characters.";
  }

  if (code.includes("auth/popup-closed-by-user")) {
    return "The Google sign-in window was closed before completion.";
  }

  if (code.includes("auth/popup-blocked")) {
    return "Your browser blocked the Google sign-in popup.";
  }

  if (code.includes("auth/cancelled-popup-request")) {
    return "Another Google sign-in popup is already open.";
  }

  if (code.includes("auth/account-exists-with-different-credential")) {
    return "An account already exists with this email using another sign-in method.";
  }

  if (code.includes("auth/operation-not-allowed")) {
    return "This sign-in method is not enabled in Firebase Authentication.";
  }

  if (code.includes("auth/configuration-not-found")) {
    return "Firebase Authentication is not fully configured for this project.";
  }

  if (code.includes("auth/unauthorized-domain")) {
    return "This domain is not authorized in Firebase Authentication.";
  }

  if (code.includes("auth/network-request-failed")) {
    return "Network request failed. Check your connection and try again.";
  }

  if (code.includes("auth/too-many-requests")) {
    return "Too many attempts. Wait a moment and try again.";
  }

  if (code.includes("auth/requires-recent-login")) {
    return "For security, sign out and sign in again before changing your email.";
  }

  if (code.includes("auth/api-key-not-valid") || code.includes("auth/invalid-api-key")) {
    return "Firebase API key is not valid for this project.";
  }

  if (code.includes("permission-denied")) {
    return "Firestore rules blocked this action. Check database permissions.";
  }

  return code
    ? `Something went wrong (${code}).`
    : "Something went wrong. Please try again.";
}
