"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import type { Order } from "@/domain/order";
import type { TeacherCourse } from "@/domain/teacher-course";
import { subscribeToTeacherOrders } from "@/lib/data/orders";
import { subscribeToTeacherCourses } from "@/lib/data/teacher-courses";

const money = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "USD",
});

export function TeacherOverviewMetrics() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  const grossMinor = paidOrders.reduce(
    (sum, order) => sum + order.amountMinor,
    0,
  );
  const feeMinor = paidOrders.reduce(
    (sum, order) =>
      sum + Math.floor((order.amountMinor * order.platformFeeBps) / 10000),
    0,
  );
  const netMinor = grossMinor - feeMinor;

  const cards = [
    {
      label: "Approved courses",
      value: String(approvedCount),
      hint: "Live on the Skillset marketplace",
    },
    {
      label: "In review",
      value: String(inReviewCount),
      hint: "Awaiting a Skillset decision",
    },
    {
      label: "Net earnings",
      value: money.format(netMinor / 100),
      hint: "Paid orders, after the 15% platform fee",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[18px] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)]"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
            {card.label}
          </p>
          {isLoading ? (
            <div className="mt-3 h-8 w-24 animate-pulse rounded bg-[var(--color-surface-strong)]" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-[var(--color-primary)]">
              {card.value}
            </p>
          )}
          <p className="mt-2 text-xs leading-5 text-[var(--color-ink-soft)]">
            {card.hint}
          </p>
        </div>
      ))}
    </section>
  );
}
