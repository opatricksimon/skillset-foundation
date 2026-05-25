export type SkillsetPlanId = "free" | "starter" | "pro" | "plus";

export const payoutReleaseDelayDays = 10;
export const automaticRefundWindowDays = 7;
export const automaticRefundProgressCap = 50;

const DEFAULT_PLATFORM_FEE_BPS = 800;
const PLAN_PLATFORM_FEE_BPS: Record<SkillsetPlanId, number> = {
  free: 800,
  starter: 400,
  pro: 100,
  plus: 0,
};

const USD_PERCENT_BPS = 290;
const INTERNATIONAL_WITH_CONVERSION_PERCENT_BPS = 540;
const FIXED_FEE_MINOR = 30;

export function canonicalPlatformFeeBpsForPlan(
  planId?: string | null,
): number {
  if (
    planId === "free" ||
    planId === "starter" ||
    planId === "pro" ||
    planId === "plus"
  ) {
    return PLAN_PLATFORM_FEE_BPS[planId];
  }

  return DEFAULT_PLATFORM_FEE_BPS;
}

export function stripeProcessingFeeMinor(
  grossMinor: number,
  currency?: string | null,
) {
  const isUsd = (currency || "").toUpperCase() === "USD";
  const percentBps = isUsd
    ? USD_PERCENT_BPS
    : INTERNATIONAL_WITH_CONVERSION_PERCENT_BPS;
  return Math.round((grossMinor * percentBps) / 10000) + FIXED_FEE_MINOR;
}

export function releasedRefundReversalAmountMinor(input: {
  grossAmountMinor: number;
  refundedAmountMinor: number;
  releasedTransferAmountMinor: number;
  alreadyReversedAmountMinor?: number | null;
}): number {
  const gross = Math.max(0, Math.floor(input.grossAmountMinor));
  const refunded = Math.max(0, Math.floor(input.refundedAmountMinor));
  const transferred = Math.max(0, Math.floor(input.releasedTransferAmountMinor));
  const alreadyReversed = Math.max(
    0,
    Math.floor(input.alreadyReversedAmountMinor ?? 0),
  );

  if (gross <= 0 || refunded <= 0 || transferred <= 0) {
    return 0;
  }

  const targetReversal = Math.min(
    transferred,
    Math.floor((transferred * Math.min(refunded, gross)) / gross),
  );

  return Math.max(0, targetReversal - alreadyReversed);
}

export type TransferReversalStripeClient = {
  transfers: {
    createReversal: (
      transferId: string,
      params: {
        amount: number;
        metadata: Record<string, string>;
      },
      options: { idempotencyKey: string },
    ) => Promise<{ id: string }>;
  };
};

export async function createReleasedRefundTransferReversal(input: {
  stripe: TransferReversalStripeClient;
  ledgerId: string;
  transferId?: string | null;
  grossAmountMinor: number;
  refundedAmountMinor: number;
  releasedTransferAmountMinor: number;
  alreadyReversedAmountMinor?: number | null;
  idempotencyKey: string;
  metadata: Record<string, string>;
}): Promise<{
  reversalId: string | null;
  reversalAmountMinor: number;
}> {
  if (!input.transferId) {
    return { reversalId: null, reversalAmountMinor: 0 };
  }

  const reversalAmountMinor = releasedRefundReversalAmountMinor({
    grossAmountMinor: input.grossAmountMinor,
    refundedAmountMinor: input.refundedAmountMinor,
    releasedTransferAmountMinor: input.releasedTransferAmountMinor,
    alreadyReversedAmountMinor: input.alreadyReversedAmountMinor,
  });

  if (reversalAmountMinor <= 0) {
    return { reversalId: null, reversalAmountMinor: 0 };
  }

  const reversal = await input.stripe.transfers.createReversal(
    input.transferId,
    {
      amount: reversalAmountMinor,
      metadata: {
        ledgerId: input.ledgerId,
        ...input.metadata,
      },
    },
    {
      idempotencyKey: input.idempotencyKey,
    },
  );

  return {
    reversalId: reversal.id,
    reversalAmountMinor,
  };
}

export function paidOrderRefundQuerySpec(userId: string, courseId: string) {
  return {
    filters: [
      ["userId", "==", userId],
      ["courseId", "==", courseId],
      ["status", "==", "paid"],
    ] as const,
    limit: 1,
  };
}
