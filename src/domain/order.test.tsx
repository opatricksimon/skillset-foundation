import { describe, expect, it } from "vitest";

import { isPaidOrder } from "@/domain/order";

describe("order domain", () => {
  it("treats only paid orders as enrollment-activating", () => {
    expect(isPaidOrder("paid")).toBe(true);
    expect(isPaidOrder("pending")).toBe(false);
    expect(isPaidOrder("failed")).toBe(false);
    expect(isPaidOrder("refunded")).toBe(false);
  });
});
