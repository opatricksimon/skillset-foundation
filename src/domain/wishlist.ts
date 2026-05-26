export type WishlistItem = {
  id: string;
  userId: string;
  courseId: string;
  courseSlug: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type WishlistInput = {
  userId: string;
  courseId: string;
  courseSlug: string;
};

export function getWishlistId(userId: string, courseId: string) {
  return `${userId}__${courseId}`;
}

export function createWishlistItem(input: WishlistInput): WishlistItem {
  return {
    id: getWishlistId(input.userId, input.courseId),
    userId: input.userId,
    courseId: input.courseId,
    courseSlug: input.courseSlug,
  };
}

export function sortWishlistItems(items: WishlistItem[]) {
  return [...items].sort((left, right) =>
    left.courseSlug.localeCompare(right.courseSlug),
  );
}
