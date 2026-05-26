"use client";

import {
  Award,
  Bookmark,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  FileText,
  LogOut,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type RefObject } from "react";

import { UserAvatar } from "@/components/shared/user-avatar";
import { planById, type PlanId } from "@/data/plans";
import { formatPrimaryRole, type SkillsetUser } from "@/domain/auth";
import { subscribeToUserProfile } from "@/lib/data/user-profiles";
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
  const [currentPlanId, setCurrentPlanId] = useState<PlanId>("free");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canTeach = hasPermission({ roles: user.roles }, "teacherStudio.access");
  const isTeacherView = pathname.startsWith("/teach");
  const isLearnerView = pathname.startsWith("/learn");
  const moneyHref = user.roles.includes("teacher")
    ? "/account/payments"
    : "/account/billing";
  const moneyLabel = user.roles.includes("teacher") ? "Payouts & tax" : "Billing";
  const currentPlanName = planById(currentPlanId).name;
  const currentViewLabel = isTeacherView ? "Creator" : "Learner";

  useDismissableLayer(wrapperRef, isOpen, () => setIsOpen(false));

  useEffect(() => {
    return subscribeToUserProfile(
      user.uid,
      (profile) => {
        setCurrentPlanId(profile?.currentPlanId ?? "free");
      },
      () => {
        setCurrentPlanId("free");
      },
    );
  }, [user.uid]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="account-menu-panel"
        aria-label="Open account menu"
        className="account-menu-trigger"
        onClick={() => setIsOpen((current) => !current)}
      >
        <UserAvatar
          name={user.displayName || user.email}
          photoURL={user.photoURL}
          size="sm"
        />
        <span className="account-menu-trigger__who">
          <span className="account-menu-trigger__name">
            {user.displayName || user.email || "Skillset member"}
          </span>
          <span className="account-menu-trigger__role">
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
          <div className="account-menu-head">
            <UserAvatar
              name={user.displayName || user.email}
              photoURL={user.photoURL}
              size="md"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--color-ink)]">
                {user.displayName || "Skillset member"}
              </p>
              <p className="mt-0.5 truncate text-xs text-[var(--color-ink-soft)]">
                {user.email}
              </p>
              <p className="account-menu-context-chip">{currentViewLabel}</p>
            </div>
          </div>

          {canTeach ? (
            <div className="account-menu-switch">
              <p className="account-menu-section-label">Switch view</p>
              <div className="grid gap-2">
                <SwitchLink
                  href="/teach"
                  icon={LayoutDashboard}
                  label="Manage teaching"
                  detail="Studio, builder, agenda, payouts"
                  active={isTeacherView}
                  onNavigate={() => setIsOpen(false)}
                />
                <SwitchLink
                  href="/learn"
                  icon={GraduationCap}
                  label="My learning"
                  detail="Courses, community, credentials"
                  active={isLearnerView}
                  onNavigate={() => setIsOpen(false)}
                />
              </div>
            </div>
          ) : null}

          <div className="py-1">
            <p className="account-menu-section-label">Account</p>
            <MenuLink
              href="/account/plans"
              icon={Award}
              label={user.roles.includes("teacher") ? "Creator plan" : "Subscription"}
              chip={currentPlanName}
              onNavigate={() => setIsOpen(false)}
            />
            <MenuLink
              href="/account"
              icon={Settings}
              label="Settings"
              onNavigate={() => setIsOpen(false)}
            />
            <MenuLink
              href={moneyHref}
              icon={FileText}
              label={moneyLabel}
              onNavigate={() => setIsOpen(false)}
            />
            <MenuLink
              href="/learn/credentials"
              icon={Bookmark}
              label="My credentials"
              onNavigate={() => setIsOpen(false)}
            />
          </div>

          <div className="account-menu-separator" />
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              void onSignOut();
            }}
            className="account-menu-item account-menu-item--danger"
          >
            <span className="account-menu-icon account-menu-icon--danger">
              <LogOut aria-hidden="true" size={14} strokeWidth={1.8} />
            </span>
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SwitchLink({
  active,
  detail,
  href,
  icon: Icon,
  label,
  onNavigate,
}: {
  active: boolean;
  detail: string;
  href: string;
  icon: LucideIcon;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      className={`account-menu-switch-link ${active ? "is-active" : ""}`}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
    >
      <span className="account-menu-icon">
        <Icon aria-hidden="true" size={14} strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      {active ? <span className="account-menu-chip">Active</span> : null}
    </Link>
  );
}

function MenuLink({
  chip,
  href,
  icon: Icon,
  label,
  onNavigate,
}: {
  chip?: string;
  href: string;
  icon: LucideIcon;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link href={href} className="account-menu-item" onClick={onNavigate}>
      <span className="account-menu-icon">
        <Icon aria-hidden="true" size={14} strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {chip ? <span className="account-menu-chip">{chip}</span> : null}
    </Link>
  );
}
