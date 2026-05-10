"use client";

import {
  collection,
  onSnapshot,
  query,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

import type { Certificate } from "@/domain/certificate";
import { getFirestoreDb, getFirebaseFunctions } from "@/lib/firebase/client";
import { getFirebaseClientConfig } from "@/lib/firebase/config";

const certificatesCollection = "certificates";

export function subscribeToUserCertificates(
  userId: string,
  callback: (certificates: Certificate[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const certificatesQuery = query(
    collection(getFirestoreDb(), certificatesCollection),
    where("userId", "==", userId),
  );

  return onSnapshot(
    certificatesQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((document) => ({
          id: document.id,
          ...(document.data() as Omit<Certificate, "id">),
        })),
      );
    },
    onError,
  );
}

export async function issueSkillsetCertificate(enrollmentId: string) {
  const issueCertificate = httpsCallable<
    { enrollmentId: string },
    { certificateId: string }
  >(getFirebaseFunctions(), "issueSkillsetCertificate");

  const result = await issueCertificate({ enrollmentId });

  return result.data.certificateId;
}

export type CertificateVerificationResult =
  | {
      valid: false;
    }
  | {
      valid: true;
      certificate: {
        courseTitle: string;
        courseCategory: string;
        authorityLabel: string;
        verificationCode: string;
        issuedAt: string | null;
      };
    };

export async function verifySkillsetCertificate(
  verificationCode: string,
): Promise<CertificateVerificationResult> {
  const verifyCertificate = httpsCallable<
    { verificationCode: string },
    CertificateVerificationResult
  >(getFirebaseFunctions(), "verifySkillsetCertificate");

  const result = await verifyCertificate({ verificationCode });

  return result.data;
}

export async function verifySkillsetCertificatePublic(
  verificationCode: string,
): Promise<CertificateVerificationResult> {
  const code = verificationCode.trim().toUpperCase();
  const endpoint = getPublicCertificateVerificationEndpoint();
  const response = await fetch(`${endpoint}?code=${encodeURIComponent(code)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Certificate verification request failed.");
  }

  return (await response.json()) as CertificateVerificationResult;
}

function getPublicCertificateVerificationEndpoint() {
  const projectId =
    getFirebaseClientConfig()?.projectId
    || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    || "skillsetusaofficial";

  return `https://us-central1-${projectId}.cloudfunctions.net/verifySkillsetCertificateHttp`;
}
