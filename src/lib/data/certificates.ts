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
        authorityLabel: "Skillset Verified";
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
