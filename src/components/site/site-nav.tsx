"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LogoWordmark } from "@/components/shared/logo-wordmark";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { SkillsetUser } from "@/domain/auth";
import {
  ChevronDown,
  CircleHelp,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Presentation,
  Receipt,
  Settings,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";

const navItems = [
  { href: "/courses", label: "Programs", hasCaret: true },
  { href: "/instructors", label: "Faculty", hasCaret: true },
  { href: "/pricing", label: "Pricing" },
  { href: "/promise", label: "Promise" },
  { href: "/courses", label: "Browse a course" },
  { href: "/help", label: "Help" },
];

const signInOptions = [
  {
    href: "/auth?mode=signin&path=student&role=student",
    icon: GraduationCap,
    title: "Access my learning",
    description: "Continue your enrolled programs",
  },
  {
    href: "/auth?mode=signin&path=teacher&role=teacher",
    icon: Presentation,
    title: "Manage my teaching",
    description: "Open Teacher Studio",
  },
];

export function SiteNav() {
  const { status, user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const isAuthenticated = status === "authenticated" && user;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="site-header__inner">
        <LogoWordmark nav />
        <nav
          aria-label="Primary navigation"
          className="site-header__links"
        >
          {navItems.map((item) => (
            <Link key={`${item.href}-${item.label}`} href={item.href} className="site-header__link">
              {item.label}
              {item.hasCaret ? (
                <ChevronDown aria-hidden="true" size={12} strokeWidth={1.8} opacity={0.55} />
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="site-header__actions">
          {isAuthenticated ? (
            <AccountMenu user={user} onSignOut={signOut} />
          ) : (
            <>
              <SignInDropdown />
              <Link href="/auth?mode=signup" className="btn-cta-hero">
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
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

function SignInDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useDismissableLayer(wrapperRef, isOpen, () => setIsOpen(false));

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`btn-signin ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
      >
        Sign in
        <ChevronDown
          aria-hidden="true"
          size={12}
          strokeWidth={1.8}
          className={isOpen ? "rotate-180 transition-transform duration-200" : "transition-transform duration-200"}
        />
      </button>
      {isOpen ? (
        <div role="menu" className="signin-dropdown">
          {signInOptions.map((option) => {
            const Icon = option.icon;

            return (
              <Link
                key={option.href}
                href={option.href}
                role="menuitem"
                className="signin-dropdown__item"
              >
                <span className="signin-dropdown__icon">
                  <Icon aria-hidden="true" size={18} strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[var(--color-ink)]">
                    {option.title}
                  </span>
                  <span className="signin-dropdown__sub">{option.description}</span>
                </span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function getPrimaryWorkspaceHref(user: SkillsetUser) {
  if (user.roles.includes("admin") || user.roles.includes("support")) {
    return "/ops";
  }

  if (user.roles.includes("teacher")) {
    return "/teach";
  }

  return "/learn";
}

function getPrimaryRoleLabel(user: SkillsetUser) {
  if (user.roles.includes("admin")) {
    return "Admin";
  }

  if (user.roles.includes("support")) {
    return "Support";
  }

  if (user.roles.includes("teacher")) {
    return "Educator";
  }

  return "Learner";
}

function AccountMenu({
  user,
  onSignOut,
}: {
  user: SkillsetUser;
  onSignOut: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const workspaceHref = getPrimaryWorkspaceHref(user);

  useDismissableLayer(wrapperRef, isOpen, () => setIsOpen(false));

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
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
            {getPrimaryRoleLabel(user)}
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
        <div role="menu" className="account-menu-panel">
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
            </div>
          </div>
          <MenuLink href={workspaceHref} icon={LayoutDashboard} label="Open workspace" />
          <MenuLink href="/account/profile" icon={UserRound} label="Profile settings" />
          <MenuLink href="/account/security" icon={Settings} label="Email & security" />
          {user.roles.includes("teacher") ? (
            <MenuLink href="/teach" icon={Presentation} label="Teacher Studio" />
          ) : null}
          <MenuLink href="/account/billing" icon={Receipt} label="Billing" />
          <div className="mt-1 border-t border-[var(--color-line)] pt-1">
            <MenuLink href="/help" icon={CircleHelp} label="Help" />
            <button
              type="button"
              role="menuitem"
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
    <Link href={href} role="menuitem" className="account-menu-item">
      <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
      {label}
    </Link>
  );
}
