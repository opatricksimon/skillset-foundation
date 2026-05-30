import { describe, expect, it } from "vitest";

import { AUDIT_ACTIONS, buildAuditEntry } from "./audit-log";

describe("audit log entry builder", () => {
  it("builds a normalized refund audit entry", () => {
    const entry = buildAuditEntry({
      action: AUDIT_ACTIONS.REFUND_ISSUED,
      actorId: "user_1",
      actorEmail: "buyer@example.com",
      targetType: "order",
      targetId: "order_1",
      summary: "Refund issued for course course_1",
      metadata: {
        refundId: "re_1",
        progressPercent: 12,
        source: "student_request",
      },
    });

    expect(entry).toEqual({
      action: "refund.issued",
      actorId: "user_1",
      actorEmail: "buyer@example.com",
      targetType: "order",
      targetId: "order_1",
      summary: "Refund issued for course course_1",
      metadata: {
        refundId: "re_1",
        progressPercent: 12,
        source: "student_request",
      },
    });
  });

  it("trims fields and defaults a blank email to null", () => {
    const entry = buildAuditEntry({
      action: AUDIT_ACTIONS.ACCOUNT_DELETION_REQUESTED,
      actorId: "  user_2  ",
      actorEmail: "   ",
      targetType: "  user  ",
      targetId: "  user_2  ",
      summary: "  Account deletion requested  ",
    });

    expect(entry.actorId).toBe("user_2");
    expect(entry.targetType).toBe("user");
    expect(entry.targetId).toBe("user_2");
    expect(entry.summary).toBe("Account deletion requested");
    expect(entry.actorEmail).toBeNull();
    expect(entry.metadata).toEqual({});
  });

  it("caps summary length and drops unsupported metadata values", () => {
    const entry = buildAuditEntry({
      action: AUDIT_ACTIONS.REFUND_ISSUED,
      actorId: "user_3",
      targetType: "order",
      targetId: "order_3",
      summary: "x".repeat(400),
      metadata: {
        keep: "ok",
        nested: { not: "allowed" },
        notFinite: Number.POSITIVE_INFINITY,
        flag: false,
        nullable: null,
        "  ": "blank key dropped",
      },
    });

    expect(entry.summary).toHaveLength(280);
    expect(entry.metadata).toEqual({ keep: "ok", flag: false, nullable: null });
  });

  it("throws when a required field is empty", () => {
    expect(() =>
      buildAuditEntry({
        action: AUDIT_ACTIONS.REFUND_ISSUED,
        actorId: "",
        targetType: "order",
        targetId: "order_4",
        summary: "Refund issued",
      }),
    ).toThrow(/actorId/);
  });
});
