/**
 * Server-side PostHog capture for Cloud Functions.
 *
 * Mirrors the client taxonomy in `src/lib/posthog/events.ts` for the events
 * that can only be observed on the backend (Stripe webhooks + callables).
 *
 * GATED: when `POSTHOG_SERVER_KEY` is absent every capture is a silent no-op.
 * That makes this module 100% safe to ship before the key is provisioned —
 * nothing breaks, events simply are not sent until the key is set (via
 * `functions/.env` or a Cloud Run env var). Telemetry never throws into a
 * payment/webhook path: every failure is swallowed and logged.
 *
 * `distinct_id` MUST be the Firebase uid so backend events stitch onto the
 * same person profile created client-side by `identifyUser(uid)`.
 */
import { PostHog } from "posthog-node";

let cachedClient: PostHog | null = null;
let resolved = false;

function getClient(): PostHog | null {
  if (resolved) {
    return cachedClient;
  }
  resolved = true;

  const apiKey = process.env.POSTHOG_SERVER_KEY;
  if (!apiKey) {
    // Fires once (guarded by `resolved`). Makes the disabled-telemetry state
    // observable in Cloud Functions logs instead of silently swallowing every
    // backend event, so an absent key during a deploy is diagnosable.
    console.info(
      "PostHog server telemetry disabled: POSTHOG_SERVER_KEY is not set. " +
        "Backend events are a no-op until the key is provisioned.",
    );
    cachedClient = null;
    return null;
  }

  const host = process.env.POSTHOG_HOST || "https://us.i.posthog.com";
  cachedClient = new PostHog(apiKey, {
    host,
    // Serverless: emit each event immediately instead of buffering, then
    // flush() before the function returns so nothing is lost on freeze.
    flushAt: 1,
    flushInterval: 0,
  });
  return cachedClient;
}

/** Canonical backend event names — kept in sync with src/lib/posthog/events.ts. */
export const SERVER_EVENTS = {
  COURSE_DRAFT_CREATED: "course_draft_created",
  COURSE_PUBLISHED: "course_published",
  CHECKOUT_COMPLETED: "checkout_completed",
  REFUND_REQUESTED: "refund_requested",
  PAYOUT_RELEASED: "payout_released",
  TEACHER_KYC_SUBMITTED: "teacher_kyc_submitted",
  TEACHER_KYC_APPROVED: "teacher_kyc_approved",
} as const;

export type ServerEventName = (typeof SERVER_EVENTS)[keyof typeof SERVER_EVENTS];

/**
 * Capture a backend event. Never throws. No-ops when the key is unset or when
 * `distinctId` is empty (we refuse to emit anonymous backend events).
 */
export async function captureServerEvent(
  distinctId: string,
  event: ServerEventName,
  properties: Record<string, unknown> = {},
): Promise<void> {
  try {
    const client = getClient();
    if (!client || !distinctId) {
      return;
    }

    client.capture({
      distinctId,
      event,
      properties: { ...properties, $lib: "skillset-functions" },
    });
    await client.flush();
  } catch (error) {
    // Telemetry must never break a webhook or callable.
    console.warn("captureServerEvent failed", {
      event,
      message: error instanceof Error ? error.message : "unknown",
    });
  }
}
