import { LogoWordmark } from "@/components/shared/logo-wordmark";
import Link from "next/link";

const navItems = [
  { href: "/courses", label: "Programs" },
  { href: "/instructors", label: "Faculty" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/platform", label: "Platform" },
];

const accessPaths = [
  {
    title: "Learner",
    eyebrow: "Study",
    description: "Browse courses, join communities, attend events, and track progress.",
    signInHref: "/login?path=student",
    signUpHref: "/signup?path=student",
  },
  {
    title: "Educator",
    eyebrow: "Teach",
    description: "Build courses, manage students, upload lessons, and submit for review.",
    signInHref: "/login?path=teacher",
    signUpHref: "/signup?path=teacher",
  },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b fine-rule bg-[rgba(255,255,255,0.94)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-1.5 sm:px-8">
        <LogoWordmark nav />
        <nav className="hidden items-center gap-4 text-[13px] font-medium text-[var(--color-ink-soft)] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2.5">
          <details className="relative md:hidden">
            <summary className="button-outline list-none px-3 py-2 text-xs marker:hidden [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 grid w-[min(calc(100vw-2rem),22rem)] gap-2 rounded-[12px] border border-[var(--color-line)] bg-white p-2 shadow-[var(--shadow-soft)]">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[8px] px-3 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-soft)]"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-1 grid gap-2 border-t border-[var(--color-line)] pt-2">
                {accessPaths.map((path) => (
                  <AccessPathCard key={path.title} {...path} compact />
                ))}
              </div>
            </div>
          </details>
          <details className="group relative">
            <summary className="button-solid list-none px-3.5 py-2 text-xs marker:hidden sm:text-sm [&::-webkit-details-marker]:hidden">
              Get started
            </summary>
            <div className="absolute right-0 mt-2 grid w-[min(calc(100vw-2rem),28rem)] gap-3 rounded-[14px] border border-[var(--color-line)] bg-white p-3 shadow-[var(--shadow-strong)]">
              <div className="px-1">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  Choose your path
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-ink-soft)]">
                  One Skillset account can learn, teach, or do both after setup.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {accessPaths.map((path) => (
                  <AccessPathCard key={path.title} {...path} />
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

function AccessPathCard({
  title,
  eyebrow,
  description,
  signInHref,
  signUpHref,
  compact = false,
}: {
  title: string;
  eyebrow: string;
  description: string;
  signInHref: string;
  signUpHref: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-[12px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h3 className="mt-1 text-sm font-bold text-[var(--color-primary)]">
        {title}
      </h3>
      <p className="mt-2 text-xs leading-5 text-[var(--color-ink-soft)]">
        {description}
      </p>
      <div className="mt-3 grid gap-2">
        <Link href={signUpHref} className="button-solid px-3 py-2 text-xs">
          Create account
        </Link>
        <Link href={signInHref} className="button-outline px-3 py-2 text-xs">
          Sign in
        </Link>
      </div>
    </div>
  );
}
