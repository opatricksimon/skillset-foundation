import { CreditCard, RadioTower, Video, Workflow, Zap } from "lucide-react";

import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { StatusChip } from "@/components/shared/status-chip";

const integrations = [
  {
    name: "Stripe Connect",
    description: "Required for paid courses, payouts, and account setup.",
    status: "pending",
    statusLabel: "Setup required",
    action: "Open payments",
    href: "/account/payments",
    icon: CreditCard,
  },
  {
    name: "Zoom",
    description: "Connect live sessions to scheduled course events.",
    status: "inactive",
    statusLabel: "Not connected",
    action: "Connect",
    href: "/teach/events",
    icon: Video,
  },
  {
    name: "Outbound webhooks",
    description: "Send enrollment, sale, and refund events to your systems.",
    status: "draft",
    statusLabel: "0 endpoints",
    action: "Add webhook",
    href: "/teach/integrations",
    icon: RadioTower,
  },
  {
    name: "ManyChat",
    description: "Audience messaging integration planned for a later release.",
    status: "pending",
    statusLabel: "Coming soon",
    action: "Coming soon",
    href: "/teach/integrations",
    icon: Workflow,
  },
  {
    name: "Zapier",
    description: "No-code workflow automation planned for a later release.",
    status: "pending",
    statusLabel: "Coming soon",
    action: "Coming soon",
    href: "/teach/integrations",
    icon: Zap,
  },
];

export default function TeacherIntegrationsPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell
        eyebrow="Teacher Studio"
        title="Integrations."
        description="Connect tools that support course delivery, payments, and creator operations."
      >
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((integration) => {
            const Icon = integration.icon;

            return (
              <article
                key={integration.name}
                className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-11 place-items-center rounded-[12px] bg-[var(--color-surface-soft)] text-[var(--color-primary)]">
                    <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
                  </div>
                  <StatusChip
                    status={integration.status}
                    label={integration.statusLabel}
                  />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[var(--color-ink)]">
                  {integration.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                  {integration.description}
                </p>
                <a
                  href={integration.href}
                  className="button-outline mt-5 px-4 py-2 text-xs"
                >
                  {integration.action}
                </a>
              </article>
            );
          })}
        </section>
      </PlatformShell>
    </ProtectedSurface>
  );
}
