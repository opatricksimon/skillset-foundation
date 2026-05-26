"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";

import {
  createWishlistItem,
  getWishlistId,
  sortWishlistItems,
  type WishlistInput,
  type WishlistItem,
} from "@/domain/wishlist";
import { getFirestoreDb } from "@/lib/firebase/client";

const wishlistsCollection = "wishlists";

export function subscribeToUserWishlist(
  userId: string,
  callback: (items: WishlistItem[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const wishlistQuery = query(
    collection(getFirestoreDb(), wishlistsCollection),
    where("userId", "==", userId),
  );

  return onSnapshot(
    wishlistQuery,
    (snapshot) => {
      callback(
        sortWishlistItems(
          snapshot.docs.map((document) => ({
            id: document.id,
            ...(document.data() as Omit<WishlistItem, "id">),
          })),
        ),
      );
    },
    onError,
  );
}

export function subscribeToUserWishlistCourseIds(
  userId: string,
  callback: (courseIds: Set<string>) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return subscribeToUserWishlist(
    userId,
    (items) => callback(new Set(items.map((item) => item.courseId))),
    onError,
  );
}

export async function toggleWishlistCourse(input: WishlistInput) {
  const wishlistRef = doc(
    getFirestoreDb(),
    wishlistsCollection,
    getWishlistId(input.userId, input.courseId),
  );
  const snapshot = await getDoc(wishlistRef);

  if (snapshot.exists()) {
    await deleteDoc(wishlistRef);
    return false;
  }

  await setDoc(wishlistRef, {
    ...createWishlistItem(input),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return true;
}
