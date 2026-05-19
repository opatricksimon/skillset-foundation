import { describe, expect, it } from "vitest";

import {
  computePaymentSplit,
  stripeProcessingFeeMinor,
} from "@/domain/payment-split";

describe("payment split — Stripe fee passed to teacher", () => {
  // Executable spec backing TEST_RESULTS.md. If these change, the documented
  // money split changed — that must be intentional.
  it.each([
    // gross, currency, commission, stripeFee, teacherNet
    [1000, "USD", 150, 59, 791],
    [5000, "USD", 750, 175, 4075],
    [10000, "USD", 1500, 320, 8180],
    [20000, "USD", 3000, 610, 16390],
    [10000, "BRL", 1500, 420, 8080],
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
    const split = computePaymentSplit(10000, "USD", 800); // 8% tier
    expect(split.platformCommissionMinor).toBe(800);
    expect(split.stripeFeeMinor).toBe(320);
    expect(split.teacherNetMinor).toBe(10000 - 800 - 320);
  });
});
