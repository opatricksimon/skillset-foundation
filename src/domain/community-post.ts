export type CommunityPostCategory =
  | "announcement"
  | "discussion"
  | "question"
  | "resource";

export type CommunityPost = {
  id: string;
  courseSlug: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  category: CommunityPostCategory;
  body: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type CommunityComment = {
  id: string;
  postId: string;
  courseSlug: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  body: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export const communityPostCategoryLabels: Record<CommunityPostCategory, string> = {
  announcement: "Announcement",
  discussion: "Discussion",
  question: "Question",
  resource: "Resource",
};
