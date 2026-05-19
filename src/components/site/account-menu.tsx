"use client";

import {
  ChevronDown,
  CircleHelp,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Presentation,
  Receipt,
  Shield,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type RefObject } from "react";

import { UserAvatar } from "@/components/shared/user-avatar";
import { formatPrimaryRole, type SkillsetUser } from "@/domain/auth";
import { hasPermission } from "@/lib/permissions";

type AccountMenuProps = {
  user: SkillsetUser;
  onSignOut: () => Promise<void>;
};

export function getPrimaryWorkspaceHref(user: SkillsetUser) {
  if (user.roles.includes("admin") || user.roles.includes("support")) {
    return "/ops";
  }

  if (user.roles.includes("teacher")) {
    return "/teach";
  }

  return "/learn";
}

function useDismissableLayer(
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleMouseDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onDismiss();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onDismiss();
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onDismiss, ref]);
}

export function AccountMenu({ onSignOut, user }: AccountMenuProps) {
  const pathname = usePathname() ?? "";
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const workspaceHref = getPrimaryWorkspaceHref(user);
  const canTeach = hasPermission({ roles: user.roles }, "teacherStudio.access");
  const activeContext = pathname.startsWith("/teach") ? "teacher" : "learner";

  useDismissableLayer(wrapperRef, isOpen, () => setIsOpen(false));

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="account-menu-panel"
        aria-label="Open account menu"
        className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-[var(--color-line)] bg-white px-2.5 py-1.5 text-left transition hover:bg-[var(--color-surface-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(44,82,130,0.28)]"
        onClick={() => setIsOpen((current) => !current)}
      >
        <UserAvatar
          name={user.displayName || user.email}
          photoURL={user.photoURL}
          size="sm"
        />
        <span className="hidden text-left sm:grid">
          <span className="max-w-32 truncate text-xs font-bold text-[var(--color-ink)]">
            {user.displayName || user.email || "Skillset member"}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            {formatPrimaryRole(user.roles)}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          size={12}
          strokeWidth={1.8}
          className={isOpen ? "rotate-180 transition-transform duration-200" : "transition-transform duration-200"}
        />
      </button>

      {isOpen ? (
        <div id="account-menu-panel" className="account-menu-panel">
          <div className="flex items-center gap-3 border-b border-[var(--color-line)] px-2 py-3">
            <UserAvatar
              name={user.displayName || user.email}
              photoURL={user.photoURL}
              size="md"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--color-ink)]">
                {user.displayName || "Skillset member"}
              </p>
              <p className="truncate text-xs text-[var(--color-ink-soft)]">
                {user.email}
              </p>
              <span className="mt-2 inline-flex rounded-[8px] border border-[rgba(178,34,52,0.18)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                {formatPrimaryRole(user.roles)}
              </span>
            </div>
          </div>

          {canTeach ? (
            <div className="border-b border-[var(--color-line)] px-1 py-3">
              <p className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                Switch view
              </p>
              <ContextSwitch
                active={activeContext === "teacher"}
                href="/teach"
                icon={Presentation}
                label="Manage my teaching"
                description="Studio, courses, wallet, payouts"
              />
              <ContextSwitch
                active={activeContext === "learner"}
                href="/learn"
                icon={GraduationCap}
                label="My learning"
                description="Courses, community, certificates"
              />
            </div>
          ) : null}

          <div className="py-1">
            <MenuLink href={workspaceHref} icon={LayoutDashboard} label="Open workspace" />
            <MenuLink href="/account/profile" icon={UserRound} label="Profile settings" />
            <MenuLink href="/account/email" icon={Mail} label="Email and password" />
            <MenuLink href="/account/security" icon={Shield} label="Security" />
            {user.roles.includes("teacher") ? (
              <MenuLink href="/account/payments" icon={CreditCard} label="Payments and payouts" />
            ) : null}
            <MenuLink href="/account/billing" icon={Receipt} label="Billing" />
          </div>

          <div className="mt-1 border-t border-[var(--color-line)] pt-1">
            <MenuLink href="/help" icon={CircleHelp} label="Help" />
            <button
              type="button"
              onClick={() => {
                void onSignOut();
              }}
              className="account-menu-item text-[var(--color-accent)] hover:bg-[rgba(178,34,52,0.06)] hover:text-[var(--color-accent)]"
            >
              <LogOut aria-hidden="true" size={16} strokeWidth={1.8} />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ContextSwitch({
  active,
  description,
  href,
  icon: Icon,
  label,
}: {
  active: boolean;
  description: string;
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="mt-2 flex items-center gap-3 rounded-[10px] px-3 py-3 transition hover:bg-[var(--color-surface-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(44,82,130,0.28)]"
    >
      <span className="grid size-9 place-items-center rounded-[10px] bg-[var(--color-surface-strong)] text-[var(--color-primary)]">
        <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-[var(--color-ink)]">
          {label}
        </span>
        <span className="mt-1 block text-[11px] font-medium text-[var(--color-ink-soft)]">
          {description}
        </span>
      </span>
      {active ? (
        <span className="rounded-[8px] border border-[rgba(178,34,52,0.18)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">
          Active
        </span>
      ) : null}
    </Link>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link href={href} className="account-menu-item">
      <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
      {label}
    </Link>
  );
}
