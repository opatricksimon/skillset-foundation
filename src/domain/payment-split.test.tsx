import { describe, expect, it } from "vitest";

import {
  computePaymentSplit,
  stripeProcessingFeeMinor,
} from "@/domain/payment-split";

describe("payment split — Stripe fee passed to teacher", () => {
  // Executable spec backing TEST_RESULTS.md. If these change, the documented
  // money split changed — that must be intentional.
  it.each([
    // Default = Free plan = 8% commission.
    // gross, currency, commission (8%), stripeFee, teacherNet
    [1000, "USD", 80, 59, 861],
    [5000, "USD", 400, 175, 4425],
    [10000, "USD", 800, 320, 8880],
    [20000, "USD", 1600, 610, 17790],
    [10000, "BRL", 800, 420, 8780],
  ])(
    "%i %s -> commission %i, stripeFee %i, net %i",
    (gross, currency, commission, stripeFee, net) => {
      const split = computePaymentSplit(gross, currency);
      expect(split.platformCommissionMinor).toBe(commission);
      expect(split.stripeFeeMinor).toBe(stripeFee);
      expect(split.teacherNetMinor).toBe(net);
      // Money conservation: nothing is created or lost.
      expect(
        split.platformCommissionMinor +
          split.stripeFeeMinor +
          split.teacherNetMinor,
      ).toBe(gross);
    },
  );

  it("treats currency case-insensitively (usd === USD)", () => {
    expect(stripeProcessingFeeMinor(10000, "usd")).toBe(
      stripeProcessingFeeMinor(10000, "USD"),
    );
  });

  it("uses the international rate (3.9%) for non-USD", () => {
    expect(stripeProcessingFeeMinor(10000, "USD")).toBe(320);
    expect(stripeProcessingFeeMinor(10000, "EUR")).toBe(420);
  });

  it("never returns a negative teacher net on tiny amounts", () => {
    const split = computePaymentSplit(50, "USD");
    expect(split.teacherNetMinor).toBeGreaterThanOrEqual(0);
  });

  it("respects a custom platform fee in bps", () => {
    const split = computePaymentSplit(10000, "USD", 800); // 8% tier (Free)
    expect(split.platformCommissionMinor).toBe(800);
    expect(split.stripeFeeMinor).toBe(320);
    expect(split.teacherNetMinor).toBe(10000 - 800 - 320);
  });

  it.each([
    // $100 USD card across each subscription tier.
    // bps, commission, stripeFee, teacherNet
    [800, 800, 320, 8880], // Free   — 8%
    [400, 400, 320, 9280], // Starter — 4%
    [100, 100, 320, 9580], // Pro    — 1%
    [0, 0, 320, 9680], //     Plus   — 0%
  ])(
    "tier %i bps -> commission %i, stripeFee %i, net %i",
    (bps, commission, stripeFee, net) => {
      const split = computePaymentSplit(10000, "USD", bps);
      expect(split.platformCommissionMinor).toBe(commission);
      expect(split.stripeFeeMinor).toBe(stripeFee);
      expect(split.teacherNetMinor).toBe(net);
    },
  );
});
