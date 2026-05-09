"use client";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";

import type { SkillsetUser } from "@/domain/auth";
import type {
  CommunityComment,
  CommunityPost,
  CommunityPostCategory,
} from "@/domain/community-post";
import type {
  CommunityReport,
  CommunityReportReason,
  CommunityReportStatus,
  CommunityReportTargetType,
} from "@/domain/community-report";
import { getFirestoreDb } from "@/lib/firebase/client";

const communityPostsCollection = "communityPosts";
const communityReportsCollection = "communityReports";

function getCreatedAtValue(item: { createdAt?: unknown }): number {
  const value = item.createdAt as { seconds?: number } | undefined;
  return value?.seconds ?? 0;
}

export async function createCommunityPost(input: {
  courseSlug: string;
  category: CommunityPostCategory;
  body: string;
  user: SkillsetUser;
}) {
  await addDoc(collection(getFirestoreDb(), communityPostsCollection), {
    courseSlug: input.courseSlug,
    authorId: input.user.uid,
    authorName: input.user.displayName?.trim() || input.user.email || "Skillset member",
    authorRole: input.user.roles[0] ?? "student",
    category: input.category,
    body: input.body.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToCommunityPosts(
  courseSlug: string,
  callback: (posts: CommunityPost[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const postsQuery = query(
    collection(getFirestoreDb(), communityPostsCollection),
    where("courseSlug", "==", courseSlug),
  );

  return onSnapshot(
    postsQuery,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((document) => ({
            id: document.id,
            ...(document.data() as Omit<CommunityPost, "id">),
          }))
          .sort((left, right) => getCreatedAtValue(right) - getCreatedAtValue(left)),
      );
    },
    onError,
  );
}

export async function createCommunityComment(input: {
  postId: string;
  courseSlug: string;
  body: string;
  user: SkillsetUser;
}) {
  await addDoc(
    collection(getFirestoreDb(), communityPostsCollection, input.postId, "comments"),
    {
      postId: input.postId,
      courseSlug: input.courseSlug,
      authorId: input.user.uid,
      authorName: input.user.displayName?.trim() || input.user.email || "Skillset member",
      authorRole: input.user.roles[0] ?? "student",
      body: input.body.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );
}

export function subscribeToCommunityComments(
  postId: string,
  callback: (comments: CommunityComment[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), communityPostsCollection, postId, "comments"),
    (snapshot) => {
      callback(
        snapshot.docs
          .map((document) => ({
            id: document.id,
            ...(document.data() as Omit<CommunityComment, "id">),
          }))
          .sort((left, right) => getCreatedAtValue(left) - getCreatedAtValue(right)),
      );
    },
    onError,
  );
}

export async function createCommunityReport(input: {
  courseSlug: string;
  postId: string;
  commentId: string | null;
  targetType: CommunityReportTargetType;
  targetAuthorId: string;
  targetAuthorName: string;
  reason: CommunityReportReason;
  detail: string | null;
  user: SkillsetUser;
}) {
  await addDoc(collection(getFirestoreDb(), communityReportsCollection), {
    courseSlug: input.courseSlug,
    postId: input.postId,
    commentId: input.commentId,
    targetType: input.targetType,
    targetAuthorId: input.targetAuthorId,
    targetAuthorName: input.targetAuthorName,
    reporterId: input.user.uid,
    reporterName: input.user.displayName?.trim() || input.user.email || "Skillset member",
    reporterEmail: input.user.email ?? null,
    reason: input.reason,
    detail: input.detail?.trim() || null,
    status: "open",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToCommunityReports(
  callback: (reports: CommunityReport[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), communityReportsCollection),
    (snapshot) => {
      callback(
        snapshot.docs
          .map((document) => ({
            id: document.id,
            ...(document.data() as Omit<CommunityReport, "id">),
          }))
          .sort((left, right) => getCreatedAtValue(right) - getCreatedAtValue(left)),
      );
    },
    onError,
  );
}

export async function updateCommunityReportStatus(
  report: CommunityReport,
  status: CommunityReportStatus,
) {
  await updateDoc(doc(getFirestoreDb(), communityReportsCollection, report.id), {
    status,
    updatedAt: serverTimestamp(),
  });
}
