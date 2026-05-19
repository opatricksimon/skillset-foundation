import { initializeApp } from "firebase-admin/app";
import {
  getFirestore,
  FieldValue,
  Timestamp,
  type DocumentReference,
} from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import {
  HttpsError,
  onCall,
  onRequest,
  type CallableRequest,
} from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import Stripe from "stripe";

initializeApp();
setGlobalOptions({ region: "us-central1", maxInstances: 10 });

const db = getFirestore();
const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const fallbackAppUrl = "https://skillsetusaofficial.web.app";

type SkillsetCurrency = string;

const defaultSkillsetCurrency = "USD";
const supportedStripeCurrencies = new Set([
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "BRL",
  "MXN",
  "NGN",
  "ZAR",
  "GYD",
  "ARS",
  "BBD",
  "BMD",
  "CLP",
  "COP",
  "CRC",
  "DOP",
  "GHS",
  "GTQ",
  "HKD",
  "INR",
  "JMD",
  "JPY",
  "KES",
  "NZD",
  "PEN",
  "SGD",
  "TTD",
  "UYU",
  "XCD",
]);

type TeacherCourseRecord = {
  ownerId: string;
  title: string;
  summary?: string;
  category: string;
  status: string;
  lessonCount?: number;
  priceAmountMinor?: number | null;
  currency?: SkillsetCurrency;
  platformFeeBps?: number;
  coverImageUrl?: string | null;
  stripeConnectedAccountId?: string | null;
};

type UserProfileRecord = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  roles?: string[];
  stripeConnectedAccountId?: string | null;
  stripeConnectChargesEnabled?: boolean;
  stripeConnectPayoutsEnabled?: boolean;
};

type EnrollmentRecord = {
  id: string;
  userId: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  courseCategory: string;
  status: string;
  source?: string;
  progressPercent?: number;
};

type PayoutLedgerRecord = {
  id: string;
  teacherId: string;
  teacherStripeConnectedAccountId?: string | null;
  courseId: string;
  orderId: string;
  paymentId: string;
  grossAmountMinor: number;
  skillsetFeeMinor: number;
  stripeFeeMinor?: number;
  netAmountMinor: number;
  currency: SkillsetCurrency;
  status: string;
  releaseAt?: unknown;
  releaseAttemptCount?: number;
};

type AccountActionRequestType = "account_deletion" | "data_export";

type CertificateVerificationResult =
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

// Payout is held until the refund window closes, then released. Kept equal to
// the automatic refund window so a teacher is paid right after a sale can no
// longer be auto-refunded (aligned with infoproduct standard, e.g. Hotmart 7d).
const payoutReleaseDelayDays = 7;
const automaticRefundWindowDays = 7;
const automaticRefundProgressCap = 50;

function sanitizeRateLimitKey(value: string) {
  return value.replace(/[^a-zA-Z0-9_.-]+/g, "_").slice(0, 220);
}

function getPayoutReleaseAt() {
  return Timestamp.fromMillis(
    Date.now() + payoutReleaseDelayDays * 24 * 60 * 60 * 1000,
  );
}

function timestampToMillis(value: unknown): number | null {
  if (value instanceof Timestamp) {
    return value.toMillis();
  }

  if (
    typeof value === "object"
    && value !== null
    && "toMillis" in value
    && typeof (value as { toMillis?: unknown }).toMillis === "function"
  ) {
    return (value as { toMillis: () => number }).toMillis();
  }

  return null;
}

function getStripeClient() {
  const secretKey = stripeSecretKey.value() || process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new HttpsError(
      "failed-precondition",
      "Stripe secret key is not configured.",
    );
  }

  return new Stripe(secretKey, {
    apiVersion: "2026-02-25.clover" as Stripe.LatestApiVersion,
  });
}

function getAppUrl() {
  return (process.env.SKILLSET_APP_URL || fallbackAppUrl).replace(/\/$/, "");
}

function normalizeSkillsetCurrency(currency?: string | null) {
  const normalizedCurrency = (currency || defaultSkillsetCurrency).toUpperCase();

  return supportedStripeCurrencies.has(normalizedCurrency)
    ? normalizedCurrency
    : defaultSkillsetCurrency;
}

function normalizeCoursePrice(course: TeacherCourseRecord) {
  const amountMinor = course.priceAmountMinor;

  if (typeof amountMinor !== "number" || amountMinor <= 0) {
    throw new HttpsError(
      "failed-precondition",
      "This course does not have a paid checkout price yet.",
    );
  }

  return {
    amountMinor,
    currency: normalizeSkillsetCurrency(course.currency).toLowerCase(),
    platformFeeBps: course.platformFeeBps ?? 1500,
  };
}

// Canonical spec + unit tests: src/domain/payment-split.ts (kept in sync;
// this is the Firebase Functions package mirror used by the Stripe webhook).
// Stripe processing fee passed through to the teacher so the platform keeps
// its full commission. USD card pricing: 2.9% + $0.30. Non-USD treated as
// international: 3.9% + $0.30 (fixed minor unit). This is an estimate applied
// at ledger time; the exact fee Stripe charges settles on the platform balance.
// NOTE: charge model is "separate_charges_and_transfers", so there is no
// application_fee_amount (that is a destination-charge concept) — the fee is
// reflected by reducing the teacher transfer (netAmountMinor) instead.
function stripeProcessingFeeMinor(
  grossMinor: number,
  currency?: string | null,
) {
  const isUsd = (currency || "").toUpperCase() === "USD";
  const percentBps = isUsd ? 290 : 390;
  const fixedMinor = 30;
  return Math.round((grossMinor * percentBps) / 10000) + fixedMinor;
}

async function enforceRateLimit(
  key: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();
  const rateLimitRef = db
    .collection("rateLimits")
    .doc(sanitizeRateLimitKey(key));

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(rateLimitRef);
    const data = snapshot.exists ? snapshot.data() || {} : {};
    const windowStartedAt = timestampToMillis(data.windowStartedAt) || 0;
    const count = Number(data.count || 0);
    const inCurrentWindow = windowStartedAt > 0 && now - windowStartedAt < windowMs;

    if (inCurrentWindow && count >= limit) {
      throw new HttpsError(
        "resource-exhausted",
        "Too many attempts. Please wait before trying again.",
      );
    }

    transaction.set(
      rateLimitRef,
      {
        count: inCurrentWindow ? count + 1 : 1,
        windowStartedAt: inCurrentWindow
          ? data.windowStartedAt
          : Timestamp.fromMillis(now),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });
}

async function createAccountActionRequest(
  request: CallableRequest,
  type: AccountActionRequestType,
) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Sign in before requesting account actions.");
  }

  const uid = request.auth.uid;
  const email =
    typeof request.auth.token.email === "string"
      ? request.auth.token.email
      : null;
  const requestRef = db.collection("accountActionRequests").doc();

  await enforceRateLimit(`account_action_${type}_${uid}`, 4, 24 * 60 * 60 * 1000);
  await requestRef.set({
    id: requestRef.id,
    type,
    requestedBy: uid,
    email,
    status: "pending",
    requestedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  logger.info("Account action request created", {
    requestId: requestRef.id,
    requestedBy: uid,
    type,
  });

  return {
    success: true,
    requestId: requestRef.id,
  };
}

export const requestDataExport = onCall(async (request) =>
  createAccountActionRequest(request, "data_export"),
);

export const requestAccountDeletion = onCall(async (request) =>
  createAccountActionRequest(request, "account_deletion"),
);

export const createCheckoutSession = onCall(
  { secrets: [stripeSecretKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in before checkout.");
    }

    const courseId = String(request.data?.courseId || "").trim();
    const userId = request.auth.uid;

    if (!courseId || courseId.length > 160) {
      throw new HttpsError("invalid-argument", "A valid courseId is required.");
    }

    await enforceRateLimit(`checkout_${userId}`, 10, 60 * 60 * 1000);

    const courseRef = db.collection("courses").doc(courseId);
    const courseSnapshot = await courseRef.get();

    if (!courseSnapshot.exists) {
      throw new HttpsError("not-found", "Course not found.");
    }

    const course = courseSnapshot.data() as TeacherCourseRecord;

    if (course.status !== "published") {
      throw new HttpsError(
        "failed-precondition",
        "Only published courses can be purchased.",
      );
    }

    const { amountMinor, currency, platformFeeBps } = normalizeCoursePrice(course);
    const enrollmentRef = db.collection("enrollments").doc(`${userId}__${courseId}`);
    const enrollmentSnapshot = await enrollmentRef.get();

    if (
      enrollmentSnapshot.exists
      && ["active", "completed"].includes(String(enrollmentSnapshot.data()?.status))
    ) {
      throw new HttpsError(
        "already-exists",
        "This course is already attached to your learning workspace.",
      );
    }

    const userEmail = request.auth.token.email
      ? String(request.auth.token.email)
      : undefined;
    const orderRef = db.collection("orders").doc();
    const appUrl = getAppUrl();
    const stripe = getStripeClient();
    const ownerSnapshot = await db.collection("users").doc(course.ownerId).get();
    const owner = ownerSnapshot.exists
      ? (ownerSnapshot.data() as UserProfileRecord)
      : null;
    const connectedAccountId =
      course.stripeConnectedAccountId || owner?.stripeConnectedAccountId || null;

    if (!connectedAccountId) {
      throw new HttpsError(
        "failed-precondition",
        "This teacher has not connected Stripe payouts yet.",
      );
    }

    if (
      owner
      && (
        owner.stripeConnectedAccountId === connectedAccountId
        && (!owner.stripeConnectChargesEnabled || !owner.stripeConnectPayoutsEnabled)
      )
    ) {
      throw new HttpsError(
        "failed-precondition",
        "This teacher must finish Stripe onboarding before paid checkout opens.",
      );
    }

    await orderRef.set({
      id: orderRef.id,
      userId,
      teacherId: course.ownerId,
      teacherStripeConnectedAccountId: connectedAccountId,
      courseId,
      courseSlug: courseId,
      courseTitle: course.title,
      amountMinor,
      currency: currency.toUpperCase(),
      platformFeeBps,
      payoutModel: "separate_charges_and_transfers",
      status: "pending",
      provider: "stripe",
      checkoutSessionId: null,
      paymentIntentId: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      customer_email: userEmail,
      client_reference_id: userId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amountMinor,
            product_data: {
              name: course.title,
              description: course.summary?.slice(0, 900),
              images: course.coverImageUrl ? [course.coverImageUrl] : undefined,
              metadata: {
                courseId,
                ownerId: course.ownerId,
              },
            },
          },
        },
      ],
      metadata: {
        orderId: orderRef.id,
        courseId,
        courseSlug: courseId,
        userId,
      },
      payment_intent_data: {
        metadata: {
          orderId: orderRef.id,
          courseId,
          courseSlug: courseId,
          userId,
        },
      },
      success_url: `${appUrl}/learn/courses/creator?courseId=${encodeURIComponent(courseId)}&checkout=success`,
      cancel_url: `${appUrl}/courses/creator?courseId=${encodeURIComponent(courseId)}&checkout=cancelled`,
    };

    const session = await stripe.checkout.sessions.create(sessionParams, {
      idempotencyKey: `checkout_${orderRef.id}`,
    });

    await orderRef.update({
      checkoutSessionId: session.id,
      updatedAt: FieldValue.serverTimestamp(),
    });

    if (!session.url) {
      throw new HttpsError("internal", "Stripe did not return a Checkout URL.");
    }

    return { url: session.url };
  },
);

export const createTeacherStripeAccountLink = onCall(
  { secrets: [stripeSecretKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in before connecting Stripe.");
    }

    const userId = request.auth.uid;

    await enforceRateLimit(
      `stripe_onboarding_${userId}`,
      10,
      60 * 60 * 1000,
    );

    const userRef = db.collection("users").doc(userId);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      throw new HttpsError("failed-precondition", "User profile not found.");
    }

    const user = userSnapshot.data() as UserProfileRecord;

    if (!Array.isArray(user.roles) || !user.roles.includes("teacher")) {
      throw new HttpsError(
        "permission-denied",
        "Only teacher accounts can connect a payout account.",
      );
    }

    const stripe = getStripeClient();
    let accountId = user.stripeConnectedAccountId || null;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email || request.auth.token.email?.toString(),
        business_type: "individual",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          skillsetUserId: userId,
        },
      });

      accountId = account.id;

      await userRef.set(
        {
          stripeConnectedAccountId: accountId,
          stripeConnectStatus: "created",
          stripeConnectChargesEnabled: Boolean(account.charges_enabled),
          stripeConnectPayoutsEnabled: Boolean(account.payouts_enabled),
          stripeConnectUpdatedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    const appUrl = getAppUrl();
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${appUrl}/teach?stripe=refresh`,
      return_url: `${appUrl}/teach?stripe=return`,
      type: "account_onboarding",
    });

    return { url: accountLink.url };
  },
);

export const refreshTeacherStripeAccount = onCall(
  { secrets: [stripeSecretKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in before refreshing Stripe.");
    }

    const userId = request.auth.uid;
    const userRef = db.collection("users").doc(userId);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      throw new HttpsError("failed-precondition", "User profile not found.");
    }

    const user = userSnapshot.data() as UserProfileRecord;
    const accountId = user.stripeConnectedAccountId;

    if (!accountId) {
      return {
        connected: false,
        chargesEnabled: false,
        payoutsEnabled: false,
      };
    }

    const account = await getStripeClient().accounts.retrieve(accountId);
    const status =
      account.charges_enabled && account.payouts_enabled
        ? "ready"
        : "onboarding_required";

    await userRef.set(
      {
        stripeConnectStatus: status,
        stripeConnectChargesEnabled: Boolean(account.charges_enabled),
        stripeConnectPayoutsEnabled: Boolean(account.payouts_enabled),
        stripeConnectUpdatedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return {
      connected: true,
      chargesEnabled: Boolean(account.charges_enabled),
      payoutsEnabled: Boolean(account.payouts_enabled),
      status,
    };
  },
);

export const requestRefund = onCall(
  { secrets: [stripeSecretKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in before requesting a refund.");
    }

    const userId = request.auth.uid;
    const enrollmentId = String(request.data?.enrollmentId || "").trim();

    if (!enrollmentId || enrollmentId.length > 220) {
      throw new HttpsError("invalid-argument", "A valid enrollmentId is required.");
    }

    await enforceRateLimit(`refund_${userId}`, 5, 60 * 60 * 1000);

    const enrollmentRef = db.collection("enrollments").doc(enrollmentId);
    const enrollmentSnapshot = await enrollmentRef.get();

    if (!enrollmentSnapshot.exists) {
      throw new HttpsError("not-found", "Enrollment not found.");
    }

    const enrollment = enrollmentSnapshot.data() as EnrollmentRecord;

    if (enrollment.userId !== userId) {
      throw new HttpsError(
        "permission-denied",
        "You can only request refunds for your own enrollments.",
      );
    }

    if (enrollment.source !== "payment") {
      throw new HttpsError(
        "failed-precondition",
        "Only paid enrollments can request a refund.",
      );
    }

    if (!["active", "completed"].includes(enrollment.status)) {
      throw new HttpsError(
        "failed-precondition",
        "This enrollment is not eligible for a refund.",
      );
    }

    if ((enrollment.progressPercent ?? 0) >= automaticRefundProgressCap) {
      throw new HttpsError(
        "failed-precondition",
        "Automatic refunds are unavailable after substantial course progress.",
      );
    }

    const certificateSnapshot = await db
      .collection("certificates")
      .doc(enrollmentId)
      .get();

    if (
      certificateSnapshot.exists
      && certificateSnapshot.data()?.status === "issued"
    ) {
      throw new HttpsError(
        "failed-precondition",
        "This enrollment already has an issued certificate.",
      );
    }

    const ordersSnapshot = await db
      .collection("orders")
      .where("userId", "==", userId)
      .limit(50)
      .get();

    const orderDocument = ordersSnapshot.docs.find((document) => {
      const order = document.data();
      return order.courseId === enrollment.courseId && order.status === "paid";
    });

    if (!orderDocument) {
      throw new HttpsError("not-found", "Paid order not found.");
    }

    const order = orderDocument.data();
    const paidAtMillis =
      timestampToMillis(order.paidAt)
      || timestampToMillis(order.createdAt)
      || 0;
    const refundDeadline =
      paidAtMillis + automaticRefundWindowDays * 24 * 60 * 60 * 1000;

    if (!paidAtMillis || Date.now() > refundDeadline) {
      throw new HttpsError(
        "failed-precondition",
        "The automatic refund window has ended.",
      );
    }

    const paymentIntentId = String(order.paymentIntentId || "");

    if (!paymentIntentId) {
      throw new HttpsError("failed-precondition", "Payment intent not found.");
    }

    const stripe = getStripeClient();
    const refund = await stripe.refunds.create(
      {
        payment_intent: paymentIntentId,
        metadata: {
          orderId: orderDocument.id,
          enrollmentId,
          userId,
          courseId: enrollment.courseId,
          source: "student_request",
        },
      },
      {
        idempotencyKey: `refund_${orderDocument.id}`,
      },
    );

    await orderDocument.ref.set(
      {
        refundRequestedAt: FieldValue.serverTimestamp(),
        refundRequestId: refund.id,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return {
      refundId: refund.id,
      status: refund.status,
    };
  },
);

export const dailyReleaseTransfers = onSchedule(
  {
    schedule: "every day 03:00",
    timeZone: "Etc/UTC",
    secrets: [stripeSecretKey],
  },
  async () => {
    const now = Date.now();
    const stripe = getStripeClient();
    const ledgerSnapshot = await db
      .collection("payoutLedger")
      .where("status", "==", "in_release")
      .limit(50)
      .get();

    let releasedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const ledgerDocument of ledgerSnapshot.docs) {
      const ledger = ledgerDocument.data() as PayoutLedgerRecord;
      const releaseAtMillis = timestampToMillis(ledger.releaseAt);

      if (!releaseAtMillis || releaseAtMillis > now) {
        skippedCount += 1;
        continue;
      }

      const claimedLedger = await claimLedgerForRelease(ledgerDocument.ref, now);

      if (!claimedLedger) {
        skippedCount += 1;
        continue;
      }

      try {
        await releaseLedgerTransfer(stripe, ledgerDocument.id, claimedLedger);
        releasedCount += 1;
      } catch (error) {
        failedCount += 1;
        logger.error("Payout ledger release failed", {
          ledgerId: ledgerDocument.id,
          error,
        });

        await ledgerDocument.ref.set(
          {
            status: "in_release",
            lastReleaseError:
              error instanceof Error ? error.message.slice(0, 500) : "Unknown error",
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      }
    }

    logger.info("Daily release transfers finished", {
      releasedCount,
      skippedCount,
      failedCount,
    });
  },
);

async function claimLedgerForRelease(
  ledgerRef: DocumentReference,
  now: number,
): Promise<PayoutLedgerRecord | null> {
  return db.runTransaction(async (transaction) => {
    const ledgerSnapshot = await transaction.get(ledgerRef);

    if (!ledgerSnapshot.exists) {
      return null;
    }

    const ledger = ledgerSnapshot.data() as PayoutLedgerRecord;
    const releaseAtMillis = timestampToMillis(ledger.releaseAt);

    if (
      ledger.status !== "in_release"
      || !releaseAtMillis
      || releaseAtMillis > now
    ) {
      return null;
    }

    transaction.set(
      ledgerRef,
      {
        status: "releasing",
        releaseAttemptCount: FieldValue.increment(1),
        lastReleaseAttemptAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return ledger;
  });
}

async function releaseLedgerTransfer(
  stripe: Stripe,
  ledgerId: string,
  ledger: PayoutLedgerRecord,
) {
  const destination = ledger.teacherStripeConnectedAccountId;
  const amount = Number(ledger.netAmountMinor || 0);
  const currency = normalizeSkillsetCurrency(ledger.currency).toLowerCase();

  if (!destination) {
    throw new Error("Teacher connected account is missing.");
  }

  if (amount <= 0) {
    await db.collection("payoutLedger").doc(ledgerId).set(
      {
        status: "released",
        transferId: null,
        releasedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return;
  }

  const transfer = await stripe.transfers.create(
    {
      amount,
      currency,
      destination,
      description: `Skillset course payout ${ledger.orderId}`,
      metadata: {
        ledgerId,
        orderId: ledger.orderId,
        courseId: ledger.courseId,
        teacherId: ledger.teacherId,
        paymentId: ledger.paymentId,
      },
    },
    {
      idempotencyKey: `transfer_${ledgerId}`,
    },
  );

  await db.collection("payoutLedger").doc(ledgerId).set(
    {
      status: "released",
      transferId: transfer.id,
      releasedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

export const issueSkillsetCertificate = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Sign in before requesting a certificate.");
  }

  const userId = request.auth.uid;
  const enrollmentId = String(request.data?.enrollmentId || "").trim();

  if (!enrollmentId || enrollmentId.length > 220) {
    throw new HttpsError("invalid-argument", "A valid enrollmentId is required.");
  }

  const enrollmentRef = db.collection("enrollments").doc(enrollmentId);
  const certificateRef = db.collection("certificates").doc(enrollmentId);

  await db.runTransaction(async (transaction) => {
    const [enrollmentSnapshot, certificateSnapshot] = await Promise.all([
      transaction.get(enrollmentRef),
      transaction.get(certificateRef),
    ]);

    if (!enrollmentSnapshot.exists) {
      throw new HttpsError("not-found", "Enrollment not found.");
    }

    const enrollment = enrollmentSnapshot.data() as EnrollmentRecord;

    if (enrollment.userId !== userId) {
      throw new HttpsError(
        "permission-denied",
        "You can only request your own certificate.",
      );
    }

    if (
      enrollment.status !== "completed"
      && (enrollment.progressPercent ?? 0) < 100
    ) {
      throw new HttpsError(
        "failed-precondition",
        "Complete the course before requesting a certificate.",
      );
    }

    if (["refunded", "revoked", "expired"].includes(enrollment.status)) {
      throw new HttpsError(
        "failed-precondition",
        "This enrollment is not eligible for certificate issuance.",
      );
    }

    if (certificateSnapshot.exists) {
      const certificate = certificateSnapshot.data() || {};

      if (certificate.status === "revoked") {
        throw new HttpsError(
          "failed-precondition",
          "This certificate was revoked by Skillset operations.",
        );
      }

      transaction.set(
        certificateRef,
        {
          status: "issued",
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      return;
    }

    const verificationCode = `SK-${enrollmentId
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 18)
      .toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    transaction.set(certificateRef, {
      id: certificateRef.id,
      enrollmentId,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      courseSlug: enrollment.courseSlug,
      courseTitle: enrollment.courseTitle,
      courseCategory: enrollment.courseCategory,
      authorityLabel: "Skillset Verified",
      status: "issued",
      verificationCode,
      issuedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  return {
    certificateId: certificateRef.id,
  };
});

export const verifySkillsetCertificate = onCall(async (request) => {
  const verificationCode = String(request.data?.verificationCode || "")
    .trim()
    .toUpperCase();

  if (!verificationCode || verificationCode.length > 80) {
    throw new HttpsError("invalid-argument", "A valid verification code is required.");
  }

  return verifyCertificateCode(verificationCode);
});

export const verifySkillsetCertificateHttp = onRequest(
  async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.set("Cache-Control", "no-store");

    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    if (request.method !== "GET") {
      response.status(405).json({ error: "Method not allowed." });
      return;
    }

    const verificationCode = String(request.query.code || "")
      .trim()
      .toUpperCase();

    if (!verificationCode || verificationCode.length > 80) {
      response.status(400).json({ error: "A valid verification code is required." });
      return;
    }

    try {
      response.status(200).json(await verifyCertificateCode(verificationCode));
    } catch (error) {
      logger.error("Public certificate verification failed", error);
      response.status(500).json({ error: "Certificate verification failed." });
    }
  },
);

async function verifyCertificateCode(
  verificationCode: string,
): Promise<CertificateVerificationResult> {
  const certificatesSnapshot = await db
    .collection("certificates")
    .where("verificationCode", "==", verificationCode)
    .where("status", "==", "issued")
    .limit(1)
    .get();

  if (certificatesSnapshot.empty) {
    return {
      valid: false,
    };
  }

  const certificate = certificatesSnapshot.docs[0].data();

  return {
    valid: true,
    certificate: {
      courseTitle: certificate.courseTitle,
      courseCategory: certificate.courseCategory,
      authorityLabel: certificate.authorityLabel || "Skillset Verified",
      verificationCode: certificate.verificationCode,
      issuedAt: certificate.issuedAt?.toDate?.().toISOString?.() ?? null,
    },
  };
}

export const stripeWebhook = onRequest(
  { secrets: [stripeSecretKey, stripeWebhookSecret] },
  async (request, response) => {
    const webhookSecret =
      stripeWebhookSecret.value() || process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      response.status(500).send("Stripe webhook secret is not configured.");
      return;
    }

    const signature = request.header("stripe-signature");

    if (!signature) {
      response.status(400).send("Missing Stripe signature.");
      return;
    }

    let event: Stripe.Event;

    try {
      event = getStripeClient().webhooks.constructEvent(
        request.rawBody,
        signature,
        webhookSecret,
      );
    } catch (error) {
      logger.warn("Stripe webhook signature verification failed", error);
      response.status(400).send("Invalid Stripe webhook signature.");
      return;
    }

    try {
      if (event.type === "checkout.session.completed") {
        await handleCheckoutCompleted(event.data.object);
      }

      if (event.type === "checkout.session.expired") {
        await markOrderStatus(event.data.object.metadata?.orderId, "cancelled");
      }

      if (event.type === "payment_intent.payment_failed") {
        await markOrderStatus(event.data.object.metadata?.orderId, "failed");
      }

      if (event.type === "charge.refunded") {
        await handleChargeRefunded(event.data.object);
      }

      response.json({ received: true });
    } catch (error) {
      logger.error("Stripe webhook handling failed", error);
      response.status(500).send("Webhook handling failed.");
    }
  },
);

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    return;
  }

  const orderId = session.metadata?.orderId;
  const courseId = session.metadata?.courseId;
  const userId = session.metadata?.userId;

  if (!orderId || !courseId || !userId) {
    throw new Error("Missing required Checkout metadata.");
  }

  const orderRef = db.collection("orders").doc(orderId);
  const courseRef = db.collection("courses").doc(courseId);
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || session.id;
  const paymentRef = db.collection("payments").doc(paymentIntentId);
  const enrollmentRef = db.collection("enrollments").doc(`${userId}__${courseId}`);
  const ledgerRef = db.collection("payoutLedger").doc(orderId);

  await db.runTransaction(async (transaction) => {
    const [orderSnapshot, courseSnapshot, enrollmentSnapshot] = await Promise.all([
      transaction.get(orderRef),
      transaction.get(courseRef),
      transaction.get(enrollmentRef),
    ]);

    if (!orderSnapshot.exists) {
      throw new Error(`Order ${orderId} not found.`);
    }

    if (!courseSnapshot.exists) {
      throw new Error(`Course ${courseId} not found.`);
    }

    const order = orderSnapshot.data() || {};
    const course = courseSnapshot.data() as TeacherCourseRecord;
    const grossAmountMinor = Number(order.amountMinor || 0);
    const platformFeeBps = Number(order.platformFeeBps || 1500);
    const skillsetFeeMinor = Math.floor((grossAmountMinor * platformFeeBps) / 10000);
    const stripeFeeMinor = stripeProcessingFeeMinor(
      grossAmountMinor,
      order.currency,
    );
    const netAmountMinor = Math.max(
      0,
      grossAmountMinor - skillsetFeeMinor - stripeFeeMinor,
    );

    transaction.set(
      paymentRef,
      {
        id: paymentRef.id,
        orderId,
        userId,
        courseId,
        amountMinor: order.amountMinor,
        currency: order.currency,
        provider: "stripe",
        providerPaymentId: paymentIntentId,
        status: "succeeded",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    transaction.update(orderRef, {
      status: "paid",
      checkoutSessionId: session.id,
      paymentIntentId,
      paidAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    transaction.set(
      ledgerRef,
      {
        id: ledgerRef.id,
        teacherId: course.ownerId,
        teacherStripeConnectedAccountId:
          order.teacherStripeConnectedAccountId || course.stripeConnectedAccountId || null,
        courseId,
        orderId,
        paymentId: paymentIntentId,
        grossAmountMinor,
        skillsetFeeMinor,
        stripeFeeMinor,
        netAmountMinor,
        currency: order.currency,
        platformFeeBps,
        status: "in_release",
        releaseAt: getPayoutReleaseAt(),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    if (!enrollmentSnapshot.exists) {
      transaction.set(enrollmentRef, {
        id: enrollmentRef.id,
        userId,
        courseId,
        courseSlug: courseId,
        courseTitle: course.title,
        courseCategory: course.category,
        courseImage:
          course.coverImageUrl
          || "https://placehold.co/900x675/0f2744/ffffff?text=Skillset+Course",
        status: "active",
        source: "payment",
        progressPercent: 0,
        lastLessonId: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  });
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!paymentIntentId) {
    logger.warn("Refunded charge has no payment intent", { chargeId: charge.id });
    return;
  }

  const paymentRef = db.collection("payments").doc(paymentIntentId);

  await db.runTransaction(async (transaction) => {
    const paymentSnapshot = await transaction.get(paymentRef);

    if (!paymentSnapshot.exists) {
      logger.warn("Refunded payment was not found", { paymentIntentId });
      return;
    }

    const payment = paymentSnapshot.data() || {};
    const orderId = String(payment.orderId || "");

    if (!orderId) {
      throw new Error(`Payment ${paymentIntentId} is missing orderId.`);
    }

    const orderRef = db.collection("orders").doc(orderId);
    const ledgerRef = db.collection("payoutLedger").doc(orderId);
    const orderSnapshot = await transaction.get(orderRef);

    if (!orderSnapshot.exists) {
      throw new Error(`Order ${orderId} not found for refunded payment.`);
    }

    const order = orderSnapshot.data() || {};
    const isFullRefund = charge.refunded === true;
    const refundedStatus = isFullRefund ? "refunded" : "partially_refunded";
    const enrollmentRef =
      isFullRefund && order.userId && order.courseId
        ? db.collection("enrollments").doc(`${order.userId}__${order.courseId}`)
        : null;
    const enrollmentSnapshot = enrollmentRef
      ? await transaction.get(enrollmentRef)
      : null;

    transaction.update(paymentRef, {
      status: refundedStatus,
      refundedAmountMinor: charge.amount_refunded,
      refundedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    transaction.update(orderRef, {
      status: refundedStatus,
      refundedAmountMinor: charge.amount_refunded,
      updatedAt: FieldValue.serverTimestamp(),
    });

    transaction.set(
      ledgerRef,
      {
        status: isFullRefund ? "refunded" : "partially_refunded",
        refundedAmountMinor: charge.amount_refunded,
        refundedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    if (enrollmentRef && enrollmentSnapshot?.exists) {
      transaction.update(enrollmentRef, {
        status: "refunded",
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  });
}

async function markOrderStatus(
  orderId: string | null | undefined,
  status: "failed" | "cancelled",
) {
  if (!orderId) {
    return;
  }

  await db.collection("orders").doc(orderId).set(
    {
      status,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}
