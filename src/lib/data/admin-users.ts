"use client";

import {
  collection,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import type { UserProfile } from "@/domain/user-profile";
import { getFirestoreDb } from "@/lib/firebase/client";

const usersCollection = "users";

export function subscribeToAdminUserProfiles(
  callback: (users: UserProfile[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), usersCollection),
    (snapshot) => {
      callback(
        snapshot.docs
          .map((document) => document.data() as UserProfile)
          .sort((left, right) =>
            (left.displayName ?? left.email ?? left.uid).localeCompare(
              right.displayName ?? right.email ?? right.uid,
            ),
          ),
      );
    },
    onError,
  );
}
