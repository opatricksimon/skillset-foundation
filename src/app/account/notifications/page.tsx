import { AccountPanel } from "@/components/account/account-panel";
import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function AccountNotificationsPage() {
  return (
    <ProtectedSurface permissions={["auth.signOut"]}>
      <PlatformShell title="Notifications" compact>
        <AccountPanel active="Notifications">
          <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 text-center shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Notification center
            </p>
            <h3 className="display-title mt-3 text-3xl text-[var(--color-primary)]">
              You&apos;re all caught up.
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
              Course reviews, billing events, support replies, and account
              security notices will appear here when there is something to
              review.
            </p>
          </section>
        </AccountPanel>
      </PlatformShell>
    </ProtectedSurface>
  );
}
