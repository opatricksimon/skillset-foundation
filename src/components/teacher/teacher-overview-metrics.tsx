"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import type { Order } from "@/domain/order";
import type { TeacherCourse } from "@/domain/teacher-course";
import { subscribeToTeacherOrders } from "@/lib/data/orders";
import { subscribeToTeacherCourses } from "@/lib/data/teacher-courses";

const money = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const kpiSparks = [
  "M0 38 C24 34 38 28 58 31 C82 34 90 16 112 18 C126 19 132 10 140 7",
  "M0 36 C20 36 34 31 54 32 C78 33 86 20 106 21 C124 22 130 13 140 8",
  "M0 39 C28 38 42 30 60 32 C82 35 90 18 110 20 C124 22 132 15 140 12",
  "M0 25 C22 26 36 18 56 20 C78 22 88 34 108 34 C124 34 132 40 140 42",
];

export function TeacherOverviewMetrics() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    if (!user) {
      return;
    }

    try {
      return subscribeToTeacherCourses(
        user.uid,
        (nextCourses) => {
          setCourses(nextCourses);
          setIsLoading(false);
        },
        () => setIsLoading(false),
      );
    } catch (error) {
      // Data layer unavailable (e.g. Firebase not initialized): degrade to an
      // empty state instead of crashing the teacher studio. Deliberate
      // one-shot recovery reset.
      console.warn(
        "TeacherOverviewMetrics: courses subscription unavailable",
        error,
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    try {
      return subscribeToTeacherOrders(user.uid, setOrders, () => {});
    } catch (error) {
      // Non-blocking metric: degrade silently in the UI but keep the failure
      // visible in logs.
      console.warn(
        "TeacherOverviewMetrics: orders subscription unavailable",
        error,
      );
    }
  }, [user]);

  const approvedCount = courses.filter(
    (course) => course.status === "published",
  ).length;
  const inReviewCount = courses.filter(
    (course) => course.status === "in_review",
  ).length;
  const paidOrders = orders.filter((order) => order.status === "paid");
  const paidOrders30d = paidOrders.filter((order) => {
    const createdAt = getTimestampMillis(order.createdAt);

    if (!createdAt) {
      return true;
    }

    return now - createdAt <= 30 * 24 * 60 * 60 * 1000;
  });
  const grossMinor = paidOrders.reduce(
    (sum, order) => sum + order.amountMinor,
    0,
  );
  const gross30dMinor = paidOrders30d.reduce(
    (sum, order) => sum + order.amountMinor,
    0,
  );
  const hasRevenue = grossMinor > 0;

  const cards = [
    {
      label: "Revenue, 30d",
      value: money.format(gross30dMinor / 100),
      hint: paidOrders30d.length ? "Paid checkout volume" : "Ready after first sale",
      delta: hasRevenue ? "+0.0%" : "0.0%",
      up: true,
    },
    {
      label: "New students",
      value: String(paidOrders30d.length),
      hint: paidOrders30d.length ? "Paid enrollments" : "No new students yet",
      delta: paidOrders30d.length ? "+0.0%" : "0.0%",
      up: true,
    },
    {
      label: "Completion",
      value: "0%",
      hint: "Unlocks after learners finish lessons",
      delta: "0.0%",
      up: true,
    },
    {
      label: "Avg rating",
      value: "--",
      hint: "No published course ratings yet",
      delta: "0.0",
      up: false,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="studio-kpi-card dash-card dash-card--strong relative overflow-hidden p-5"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
            {card.label}
          </p>
          {isLoading ? (
            <div className="mt-3 h-8 w-24 animate-pulse rounded bg-[var(--color-surface-strong)]" />
          ) : (
            <p className="mt-2 text-4xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
              {card.value}
            </p>
          )}
          <div
            className={`mt-2 inline-flex items-center gap-1 text-xs font-bold ${
              card.up ? "text-[var(--color-success)]" : "text-[var(--color-accent)]"
            }`}
          >
            {card.up ? (
              <TrendingUp aria-hidden="true" size={13} />
            ) : (
              <TrendingDown aria-hidden="true" size={13} />
            )}
            {card.delta}
            <span className="font-semibold text-[var(--color-ink-soft)]">vs prev period</span>
          </div>
          <p className="mt-2 max-w-[13rem] text-xs leading-5 text-[var(--color-ink-soft)]">
            {card.hint}
          </p>
          <svg
            viewBox="0 0 140 44"
            aria-hidden="true"
            className="absolute bottom-0 right-0 h-14 w-36 opacity-70"
          >
            <path
              d={hasRevenue ? kpiSparks[index] : "M0 38 C24 38 46 38 70 38 C94 38 116 38 140 38"}
              fill="none"
              stroke={card.up ? "var(--color-primary)" : "var(--color-accent)"}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
      <span className="sr-only">
        Published courses: {approvedCount}. In review: {inReviewCount}.
      </span>
    </section>
  );
}

function getTimestampMillis(value: unknown): number | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "object" && "toMillis" in value) {
    const maybeTimestamp = value as { toMillis?: () => number };

    return typeof maybeTimestamp.toMillis === "function"
      ? maybeTimestamp.toMillis()
      : null;
  }

  if (typeof value === "object" && "seconds" in value) {
    const maybeTimestamp = value as { seconds?: number };

    return typeof maybeTimestamp.seconds === "number"
      ? maybeTimestamp.seconds * 1000
      : null;
  }

  return null;
}
