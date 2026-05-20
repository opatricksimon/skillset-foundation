"use client";

import { useEffect, useState } from "react";

import { StatusChip } from "@/components/shared/status-chip";
import {
  subscribeToAccountActionRequests,
  type AccountActionRequest,
} from "@/lib/data/account-actions";

function formatType(type: AccountActionRequest["type"]) {
  return type === "data_export" ? "Data export" : "Account deletion";
}

function formatDate(request: AccountActionRequest) {
  const date = request.requestedAt?.toDate?.();

  if (!date) {
    return "Pending timestamp";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function AccountActionRequestsPanel() {
  const [requests, setRequests] = useState<AccountActionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    return subscribeToAccountActionRequests(
      (nextRequests) => {
        setRequests(nextRequests);
        setIsLoading(false);
      },
      () => {
        setError("We could not load account action requests.");
        setIsLoading(false);
      },
    );
  }, []);

  return (
    <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
        Account actions
      </p>
      <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
        Export and deletion requests.
      </h3>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
        Promise Section 03 and Section 04 requests land here while export and
        deletion are processed manually.
      </p>

      <div className="mt-5 grid gap-3">
        {isLoading ? (
          <p className="text-sm text-[var(--color-ink-soft)]">
            Loading account action requests...
          </p>
        ) : error ? (
          <p className="rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
            {error}
          </p>
        ) : requests.length === 0 ? (
          <div className="rounded-[4px] border border-dashed border-[var(--color-line-strong)] bg-[var(--color-surface-soft)] p-5 text-sm leading-7 text-[var(--color-ink-soft)]">
            No account action requests yet.
          </div>
        ) : (
          requests.map((request) => (
            <article
              key={request.id}
              className="rounded-[4px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[var(--color-ink)]">
                    {formatType(request.type)}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--color-ink-soft)]">
                    User {request.requestedBy}
                    {request.email ? ` - ${request.email}` : ""}
                  </p>
                </div>
                <StatusChip status={request.status} />
              </div>
              <p className="mt-3 text-xs leading-5 text-[var(--color-ink-soft)]">
                Requested {formatDate(request)} - Request ID {request.id}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
