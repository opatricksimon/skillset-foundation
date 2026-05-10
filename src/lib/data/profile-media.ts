"use client";

import { updateProfile } from "firebase/auth";
import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { getFirebaseAuth, getFirebaseStorage, getFirestoreDb } from "@/lib/firebase/client";

const maxAvatarBytes = 5 * 1024 * 1024;

export type UploadAvatarProgress = {
  bytesTransferred: number;
  totalBytes: number;
  percent: number;
};

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 80) || "avatar";
}

export function isAllowedAvatarFile(file: File) {
  return file.size > 0
    && file.size <= maxAvatarBytes
    && file.type.startsWith("image/");
}

export async function uploadUserAvatar(
  uid: string,
  file: File,
  onProgress?: (progress: UploadAvatarProgress) => void,
) {
  if (!isAllowedAvatarFile(file)) {
    throw new Error("Use an image file under 5 MB.");
  }

  const safeFileName = sanitizeFileName(file.name);
  const storagePath = `users/${uid}/avatar/${Date.now()}-${safeFileName}`;
  const storageRef = ref(getFirebaseStorage(), storagePath);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      uid,
      kind: "profile_avatar",
    },
  });

  await new Promise<void>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        onProgress?.({
          bytesTransferred: snapshot.bytesTransferred,
          totalBytes: snapshot.totalBytes,
          percent: Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          ),
        });
      },
      reject,
      resolve,
    );
  });

  const photoURL = await getDownloadURL(storageRef);

  await updateDoc(doc(getFirestoreDb(), "users", uid), {
    photoURL,
    updatedAt: serverTimestamp(),
  });

  const currentUser = getFirebaseAuth().currentUser;

  if (currentUser?.uid === uid) {
    await updateProfile(currentUser, { photoURL }).catch(() => undefined);
  }

  return photoURL;
}
