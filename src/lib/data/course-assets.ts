"use client";

import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import {
  deleteObject,
  getBlob,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import type { CourseAsset, CourseAssetKind } from "@/domain/course-asset";
import { isAllowedCourseAssetFile } from "@/domain/course-asset";
import { getFirebaseStorage, getFirestoreDb } from "@/lib/firebase/client";

const coursesCollection = "courses";
const assetsCollection = "assets";
const publicDownloadKinds = new Set<CourseAssetKind>(["course_cover"]);

type UploadCourseAssetInput = {
  courseId: string;
  ownerId: string;
  kind: CourseAssetKind;
  file: File;
  isPreview: boolean;
  lessonId?: string | null;
  moduleId?: string | null;
  onProgress?: (progress: UploadCourseAssetProgress) => void;
};

export type UploadCourseAssetProgress = {
  bytesTransferred: number;
  totalBytes: number;
  percent: number;
  state: "paused" | "running" | "success";
};

function createAssetId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 120) || "asset";
}

export async function uploadCourseAsset(input: UploadCourseAssetInput) {
  if (!isAllowedCourseAssetFile(input.file, input.kind)) {
    throw new Error("Unsupported file type or file too large.");
  }

  const assetId = createAssetId();
  const safeFileName = sanitizeFileName(input.file.name);
  const storagePath = `courses/${input.courseId}/assets/${input.ownerId}/${assetId}/${safeFileName}`;
  const storageRef = ref(getFirebaseStorage(), storagePath);
  const assetDoc = doc(
    getFirestoreDb(),
    coursesCollection,
    input.courseId,
    assetsCollection,
    assetId,
  );
  const courseDoc = doc(getFirestoreDb(), coursesCollection, input.courseId);

  try {
    const uploadTask = uploadBytesResumable(storageRef, input.file, {
      contentType: input.file.type,
      customMetadata: {
        courseId: input.courseId,
        ownerId: input.ownerId,
        kind: input.kind,
        lessonId: input.lessonId ?? "",
        moduleId: input.moduleId ?? "",
      },
    });

    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          input.onProgress?.({
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            percent: Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            ),
            state: snapshot.state === "paused" ? "paused" : "running",
          });
        },
        reject,
        () => {
          input.onProgress?.({
            bytesTransferred: input.file.size,
            totalBytes: input.file.size,
            percent: 100,
            state: "success",
          });
          resolve();
        },
      );
    });
    const downloadUrl = publicDownloadKinds.has(input.kind)
      ? await getDownloadURL(storageRef)
      : null;

    await setDoc(assetDoc, {
      id: assetId,
      courseId: input.courseId,
      ownerId: input.ownerId,
      kind: input.kind,
      fileName: input.file.name,
      contentType: input.file.type,
      size: input.file.size,
      storagePath,
      downloadUrl,
      isPreview: input.isPreview,
      lessonId: input.lessonId ?? null,
      moduleId: input.moduleId ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    if (input.kind === "course_cover") {
      await updateDoc(courseDoc, {
        coverImageUrl: downloadUrl,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    await deleteObject(storageRef).catch(() => undefined);
    throw error;
  }

  return assetId;
}

export async function getProtectedCourseAssetObjectUrl(asset: CourseAsset) {
  const blob = await getBlob(ref(getFirebaseStorage(), asset.storagePath));

  return URL.createObjectURL(blob);
}

export function subscribeToCourseAssets(
  courseId: string,
  callback: (assets: CourseAsset[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), coursesCollection, courseId, assetsCollection),
    (snapshot) => {
      callback(
        snapshot.docs
          .map((document) => ({
            id: document.id,
            ...(document.data() as Omit<CourseAsset, "id">),
          }))
          .sort((left, right) => left.fileName.localeCompare(right.fileName)),
      );
    },
    onError,
  );
}
