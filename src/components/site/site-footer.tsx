import Link from "next/link";

import { LogoWordmark } from "@/components/shared/logo-wordmark";

const footerColumns = [
  {
    title: "Product",
    links: [
      ["Courses", "/courses"],
      ["How it works", "/how-it-works"],
      ["Pricing", "/pricing"],
      ["Trust", "/trust"],
    ],
  },
  {
    title: "For creators",
    links: [
      ["Creator overview", "/for-creators"],
      ["Fees and payouts", "/fees-and-payouts"],
      ["Teacher terms", "/legal/teacher-terms"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Help center", "/help"],
      ["Support", "/support"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Terms", "/legal/terms"],
      ["Privacy", "/legal/privacy"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-7xl px-6 pb-10 pt-12 sm:px-8">
      <div className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <LogoWordmark compact />
            <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--color-ink-soft)]">
              Skillset is an international course marketplace and learning
              community for serious creators and learners.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {column.title}
                </p>
                <div className="mt-3 grid gap-2">
                  {column.links.map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="text-sm font-semibold text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-primary)]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--color-line)] pt-5 text-xs leading-6 text-[var(--color-ink-soft)]">
          &copy; {new Date().getFullYear()} Skillset. Built for course-first learning,
          transparent creator payouts, and trusted student progress.
        </div>
      </div>
    </footer>
  );
}
