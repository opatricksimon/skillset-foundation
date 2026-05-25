import { describe, expect, it, vi } from "vitest";

import {
  canonicalPlatformFeeBpsForPlan,
  createReleasedRefundTransferReversal,
  paidOrderRefundQuerySpec,
  payoutReleaseDelayDays,
  releasedRefundReversalAmountMinor,
  stripeProcessingFeeMinor,
} from "./payment-rules";

describe("functions payment rules", () => {
  it("uses a 10 day payout release delay", () => {
    expect(payoutReleaseDelayDays).toBe(10);
  });

  it("keeps plan commission canonical across Free, Starter, Pro, and Plus", () => {
    expect(canonicalPlatformFeeBpsForPlan("free")).toBe(800);
    expect(canonicalPlatformFeeBpsForPlan("starter")).toBe(400);
    expect(canonicalPlatformFeeBpsForPlan("pro")).toBe(100);
    expect(canonicalPlatformFeeBpsForPlan("plus")).toBe(0);
    expect(canonicalPlatformFeeBpsForPlan("unknown")).toBe(800);
  });

  it("estimates non-USD Stripe processing at 5.4% plus fixed fee", () => {
    expect(stripeProcessingFeeMinor(10000, "USD")).toBe(320);
    expect(stripeProcessingFeeMinor(10000, "EUR")).toBe(570);
    expect(stripeProcessingFeeMinor(10000, "brl")).toBe(570);
  });

  it("looks up refund orders by user, course, and paid status directly", () => {
    expect(paidOrderRefundQuerySpec("user_1", "course_1")).toEqual({
      filters: [
        ["userId", "==", "user_1"],
        ["courseId", "==", "course_1"],
        ["status", "==", "paid"],
      ],
      limit: 1,
    });
  });

  it("calculates a proportional reversal after a released transfer", () => {
    expect(
      releasedRefundReversalAmountMinor({
        grossAmountMinor: 10000,
        refundedAmountMinor: 2500,
        releasedTransferAmountMinor: 8880,
        alreadyReversedAmountMinor: 0,
      }),
    ).toBe(2220);

    expect(
      releasedRefundReversalAmountMinor({
        grossAmountMinor: 10000,
        refundedAmountMinor: 10000,
        releasedTransferAmountMinor: 8880,
        alreadyReversedAmountMinor: 2220,
      }),
    ).toBe(6660);
  });

  it("creates a Stripe transfer reversal for refund amounts after payout release", async () => {
    const createReversal = vi.fn().mockResolvedValue({ id: "trr_123" });
    const result = await createReleasedRefundTransferReversal({
      stripe: {
        transfers: {
          createReversal,
        },
      },
      ledgerId: "order_123",
      transferId: "tr_123",
      grossAmountMinor: 10000,
      refundedAmountMinor: 2500,
      releasedTransferAmountMinor: 8880,
      alreadyReversedAmountMinor: 0,
      idempotencyKey: "transfer_reversal_order_123_ch_123_2220",
      metadata: {
        orderId: "order_123",
        paymentId: "pi_123",
      },
    });

    expect(result).toEqual({
      reversalId: "trr_123",
      reversalAmountMinor: 2220,
    });
    expect(createReversal).toHaveBeenCalledWith(
      "tr_123",
      {
        amount: 2220,
        metadata: {
          ledgerId: "order_123",
          orderId: "order_123",
          paymentId: "pi_123",
        },
      },
      {
        idempotencyKey: "transfer_reversal_order_123_ch_123_2220",
      },
    );
  });
});
