"use client";

import {
  Bell,
  BookOpen,
  Database,
  LockKeyhole,
  Mail,
  Shield,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AccountDataPanel } from "@/components/account/account-data-panel";
import { ProfileSettingsPanel } from "@/components/account/profile-settings-panel";
import { SecuritySettingsPanel } from "@/components/account/security-settings-panel";
import { useAuth } from "@/components/auth/auth-provider";

type SettingsTab =
  | "profile"
  | "account"
  | "notifications"
  | "security"
  | "learning"
  | "privacy";

const tabs: Array<{
  value: SettingsTab;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    value: "profile",
    label: "Profile",
    description: "Name, photo, username, bio, phone, timezone.",
    icon: UserRound,
  },
  {
    value: "account",
    label: "Account",
    description: "Email verification and login identity.",
    icon: Mail,
  },
  {
    value: "notifications",
    label: "Notifications",
    description: "Course, billing, and support alerts.",
    icon: Bell,
  },
  {
    value: "security",
    label: "Security",
    description: "Password, MFA readiness, and sensitive access.",
    icon: Shield,
  },
  {
    value: "learning",
    label: "Learning",
    description: "Playback, captions, digest, and classroom defaults.",
    icon: BookOpen,
  },
  {
    value: "privacy",
    label: "Privacy & data",
    description: "Export data or request account deletion.",
    icon: Database,
  },
];

export function AccountSettingsHub() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = isSettingsTab(requestedTab) ? requestedTab : "profile";

  function selectTab(nextTab: SettingsTab) {
    router.replace(`/account?tab=${nextTab}`, { scroll: false });
  }

  return (
    <div className="space-y-6">
      <header className="platform-hero-card rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          Settings
        </p>
        <h1 className="display-title mt-3 text-4xl leading-tight text-[var(--color-primary)] lg:text-5xl">
          Your Skillset preferences.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-ink-soft)]">
          Profile, login email, password, alerts, learning defaults, and privacy
          controls live here. Billing and creator payouts stay in their own
          money sections.
        </p>
      </header>

      <div className="account-settings-grid">
        <nav className="account-settings-tabs" aria-label="Settings sections">
          {tabs.map((tab) => (
            <SettingsTabButton
              key={tab.value}
              active={activeTab === tab.value}
              icon={tab.icon}
              label={tab.label}
              description={tab.description}
              onClick={() => selectTab(tab.value)}
            />
          ))}
        </nav>

        <div className="min-w-0 space-y-5">{renderTab(activeTab)}</div>
      </div>
    </div>
  );
}

function renderTab(tab: SettingsTab) {
  if (tab === "profile") {
    return <ProfileSettingsPanel />;
  }

  if (tab === "account") {
    return <AccountIdentityPanel />;
  }

  if (tab === "notifications") {
    return <NotificationPreferencesPanel />;
  }

  if (tab === "security") {
    return <SecuritySettingsPanel />;
  }

  if (tab === "learning") {
    return <LearningPreferencesPanel />;
  }

  return <AccountDataPanel />;
}

function SettingsTabButton({
  active,
  description,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  description: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`account-settings-tab ${active ? "account-settings-tab--active" : ""}`}
    >
      <span className="account-settings-tab__icon">
        <Icon aria-hidden="true" size={16} strokeWidth={2} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold">{label}</span>
        <span className="mt-1 block text-left text-[11px] font-medium leading-4">
          {description}
        </span>
      </span>
    </button>
  );
}

function AccountIdentityPanel() {
  const { user } = useAuth();

  return (
    <section className="settings-section-card">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
        Account
      </p>
      <h2 className="display-title mt-3 text-3xl text-[var(--color-primary)]">
        Login identity.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
        Email is part of Settings because it controls authentication,
        verification, and account recovery. Use Security for password changes.
      </p>

      <div className="mt-6 grid gap-3">
        <SettingsInfoRow
          icon={Mail}
          title="Current email"
          description={user?.email || "No email connected to this session."}
          value={user?.emailVerified ? "Verified" : "Verification required"}
          tone={user?.emailVerified ? "success" : "danger"}
        />
        <SettingsInfoRow
          icon={LockKeyhole}
          title="Where to change it"
          description="Open the Security tab to resend verification, change email, or update password."
          value="Security tab"
          tone="neutral"
        />
      </div>
    </section>
  );
}

function NotificationPreferencesPanel() {
  const [productEmails, setProductEmails] = useState(true);
  const [courseActivity, setCourseActivity] = useState(true);
  const [billingAlerts, setBillingAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <section className="settings-section-card">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
        Notifications
      </p>
      <h2 className="display-title mt-3 text-3xl text-[var(--color-primary)]">
        Decide what gets your attention.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
        These preferences shape the product notification center. Transactional
        security and payment emails stay enabled for account safety.
      </p>

      <div className="mt-6 divide-y divide-[var(--color-line)]">
        <ToggleRow
          label="Product emails"
          description="Important product updates and weekly summaries."
          checked={productEmails}
          onChange={() => setProductEmails((current) => !current)}
        />
        <ToggleRow
          label="Course activity"
          description="Course reviews, comments, lesson activity, and student milestones."
          checked={courseActivity}
          onChange={() => setCourseActivity((current) => !current)}
        />
        <ToggleRow
          label="Billing and payout alerts"
          description="Receipts, invoices, payout release, refund, and failed payment notices."
          checked={billingAlerts}
          onChange={() => setBillingAlerts((current) => !current)}
        />
        <ToggleRow
          label="Marketing emails"
          description="Launch announcements, promotions, and editorial campaigns."
          checked={marketingEmails}
          onChange={() => setMarketingEmails((current) => !current)}
        />
      </div>
    </section>
  );
}

function LearningPreferencesPanel() {
  const [autoCaptions, setAutoCaptions] = useState(true);
  const [digest, setDigest] = useState(false);

  return (
    <section className="settings-section-card">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
        Learning
      </p>
      <h2 className="display-title mt-3 text-3xl text-[var(--color-primary)]">
        Classroom defaults.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
        Keep learner behavior separate from billing and creator payout setup.
      </p>

      <div className="mt-6 divide-y divide-[var(--color-line)]">
        <ToggleRow
          label="Auto-show captions"
          description="Show captions automatically when a lesson provides them."
          checked={autoCaptions}
          onChange={() => setAutoCaptions((current) => !current)}
        />
        <ToggleRow
          label="Daily learning digest"
          description="A lightweight daily reminder for unfinished lessons."
          checked={digest}
          onChange={() => setDigest((current) => !current)}
        />
      </div>
    </section>
  );
}

function SettingsInfoRow({
  description,
  icon: Icon,
  title,
  tone,
  value,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
  tone: "danger" | "neutral" | "success";
  value: string;
}) {
  return (
    <div className="settings-info-row">
      <span className="settings-info-row__icon">
        <Icon aria-hidden="true" size={17} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-[var(--color-ink)]">
          {title}
        </span>
        <span className="mt-1 block text-sm leading-6 text-[var(--color-ink-soft)]">
          {description}
        </span>
      </span>
      <span className={`settings-pill settings-pill--${tone}`}>{value}</span>
    </div>
  );
}

function ToggleRow({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  label: string;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <span>
        <span className="block text-sm font-bold text-[var(--color-ink)]">
          {label}
        </span>
        <span className="mt-1 block max-w-2xl text-sm leading-6 text-[var(--color-ink-soft)]">
          {description}
        </span>
      </span>
      <button
        type="button"
        aria-pressed={checked}
        onClick={onChange}
        className={`settings-toggle ${checked ? "settings-toggle--on" : ""}`}
      >
        <span />
      </button>
    </div>
  );
}

function isSettingsTab(value: string | null): value is SettingsTab {
  return tabs.some((tab) => tab.value === value);
}
