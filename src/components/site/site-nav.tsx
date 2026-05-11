"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { AccountMenu } from "@/components/site/account-menu";
import { LogoWordmark } from "@/components/shared/logo-wordmark";
import {
  ChevronDown,
  GraduationCap,
  Presentation,
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

