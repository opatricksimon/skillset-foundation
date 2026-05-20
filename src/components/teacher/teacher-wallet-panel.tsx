"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { InlineHelp } from "@/components/shared/inline-help";
import { StatusChip } from "@/components/shared/status-chip";
import type { Order } from "@/domain/order";
import type { PayoutLedgerEntry } from "@/domain/payout-ledger";
import type { UserProfile } from "@/domain/user-profile";
import { subscribeToTeacherOrders } from "@/lib/data/orders";
import { subscribeToTeacherPayoutLedger } from "@/lib/data/payout-ledger";
import { subscribeToUserProfile } from "@/lib/data/user-profiles";
import {
  refreshTeacherStripeAccountStatus,
  startTeacherStripeOnboarding,
} from "@/lib/payments/connect";

export function TeacherWalletPanel() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<PayoutLedgerEntry[]>([]);
  const stripeReturn = searchParams.get("stripe");

  useEffect(() => {
    if (!user) {
      return;
    }

    return subscribeToUserProfile(
      user.uid,
      (nextProfile) => {
        setProfile(nextProfile);
        setIsLoading(false);
      },
      () => {
        setError("We could not load your payout profile.");
        setIsLoading(false);
      },
    );
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    return subscribeToTeacherPayoutLedger(
      user.uid,
      setLedgerEntries,
      () => {
        setError("We could not load payout release reporting.");
      },
    );
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    return subscribeToTeacherOrders(
      user.uid,
      setOrders,
      () => {
        setError("We could not load teacher order reporting.");
      },
    );
  }, [user]);

  useEffect(() => {
    if (!user || stripeReturn !== "return") {
      return;
    }

    startTransition(() => {
      setIsWorking(true);
    });
    void refreshTeacherStripeAccountStatus()
      .then((status) => {
        startTransition(() => {
          setMessage(
            status.payoutsEnabled
              ? "Stripe payouts are ready for this teacher account."
              : "Stripe onboarding was saved. Stripe may still require more information before payouts are enabled.",
          );
        });
      })
      .catch(() => {
        startTransition(() => {
          setError("We could not refresh Stripe payout status.");
        });
      })
      .finally(() => {
        startTransition(() => {
          setIsWorking(false);
        });
      });
  }, [stripeReturn, user]);

  async function handleConnectStripe() {
    setError("");
    setMessage("");
    setIsWorking(true);

    try {
      await startTeacherStripeOnboarding();
    } catch {
      setError("We could not open Stripe onboarding. Try again in a moment.");
      setIsWorking(false);
    }
  }

  const connected = Boolean(profile?.stripeConnectedAccountId);
  const ready = Boolean(
    profile?.stripeConnectChargesEnabled && profile?.stripeConnectPayoutsEnabled,
  );
  const statusLabel = ready
    ? "Ready"
    : connected
      ? "Onboarding required"
      : "Not connected";
  const paidOrders = orders.filter((order) => order.status === "paid");
  const grossPaidMinor = paidOrders.reduce(
    (sum, order) => sum + order.amountMinor,
    0,
  );
  const platformFeeMinor = paidOrders.reduce(
    (sum, order) =>
      sum + Math.floor((order.amountMinor * order.platformFeeBps) / 10000),
    0,
  );
  const teacherNetMinor = grossPaidMinor - platformFeeMinor;
  const inReleaseMinor = ledgerEntries
    .filter((entry) => ["in_release", "releasing"].includes(entry.status))
    .reduce((sum, entry) => sum + entry.netAmountMinor, 0);
  const releasedMinor = ledgerEntries
    .filter((entry) => ["released", "released_advance"].includes(entry.status))
    .reduce((sum, entry) => sum + entry.netAmountMinor, 0);
  const refundedMinor = ledgerEntries
    .filter((entry) => ["refunded", "partially_refunded"].includes(entry.status))
    .reduce(
      (sum, entry) => sum + (entry.refundedAmountMinor ?? entry.grossAmountMinor),
      0,
    );
  const money = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  });

  return (
    <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-baseline gap-2 border-b border-[var(--color-line)] pb-4">
        <h3 className="text-base font-bold text-[var(--color-ink)]">Connect payouts before selling.</h3>
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">Teacher wallet</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
        Skillset uses Stripe Connect for teacher payouts. Students pay through
        Skillset Checkout; Stripe can route the teacher share to the connected
        account while Skillset keeps the platform fee.
      </p>
      <InlineHelp topic="Payout schedule" href="/help#payouts" className="mt-4">
        Earnings clear from pending to available 7 days after each sale,
        matching the refund window so cleared payouts never need to be
        clawed back.
      </InlineHelp>

      <div className="mt-5 grid gap-3 rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="font-semibold text-[var(--color-ink)]">
            Payout status
          </span>
          <span className="rounded-[8px] bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">
            {isLoading ? "Loading" : statusLabel}
          </span>
        </div>
        <p className="text-xs leading-6 text-[var(--color-ink-soft)]">
          Courses can be drafted before payout setup. Paid publication should
          wait until Stripe onboarding is complete.
        </p>
      </div>

      {message ? (
        <p className="mt-4 rounded-[10px] border border-[rgba(24,58,94,0.12)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleConnectStripe}
        disabled={isWorking || isLoading}
        className="button-solid mt-5 px-5 py-3 text-sm disabled:opacity-60"
      >
        {isWorking
          ? "Opening Stripe..."
          : connected
            ? "Continue Stripe onboarding"
            : "Connect Stripe payouts"}
      </button>

      <div className="mt-6 grid gap-3 border-t border-[var(--color-line)] pt-5 sm:grid-cols-3">
        {[
          ["Paid orders", String(paidOrders.length)],
          ["Gross sales", money.format(grossPaidMinor / 100)],
          ["Teacher net est.", money.format(teacherNetMinor / 100)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
              {label}
            </p>
            <p className="mt-2 text-lg font-bold text-[var(--color-primary)]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["In release", money.format(inReleaseMinor / 100)],
          ["Released", money.format(releasedMinor / 100)],
          ["Refunded", money.format(refundedMinor / 100)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-[12px] border fine-rule bg-white p-4"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
              {label}
            </p>
            <p className="mt-2 text-lg font-bold text-[var(--color-primary)]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-[var(--color-line)] pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
              Recent sales
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              Click a sale to inspect payment and order details.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          {orders.length === 0 ? (
            <p className="rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-ink-soft)]">
              No sales yet. Paid orders will appear here after checkout succeeds.
            </p>
          ) : (
            orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href={`/teach/sales/${order.id}`}
                className="rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4 transition duration-[180ms] hover:-translate-y-0.5 hover:bg-white hover:shadow-[var(--shadow-soft)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <StatusChip status={order.status} />
                    <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                      {order.courseTitle}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                      Order {order.id}
                    </p>
                  </div>
                  <span className="rounded-[8px] bg-white px-3 py-1 text-sm font-bold text-[var(--color-primary)]">
                    {new Intl.NumberFormat("en", {
                      style: "currency",
                      currency: order.currency,
                    }).format(order.amountMinor / 100)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
