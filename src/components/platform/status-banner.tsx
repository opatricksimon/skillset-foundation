"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import type { SkillsetUser } from "@/domain/auth";
import type { UserProfile } from "@/domain/user-profile";
import { subscribeToUserProfile } from "@/lib/data/user-profiles";

type BannerState = {
  message: string;
  ctaLabel: string;
  ctaHref: string;
};

export function StatusBanner() {
  const { status, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !user) {
      return;
    }

    return subscribeToUserProfile(
      user.uid,
      setProfile,
      () => setProfile(null),
    );
  }, [status, user]);

  if (status !== "authenticated" || !user) {
    return null;
  }

  const banner = getAccountBanner(user, profile);

  if (!banner) {
    return null;
  }

  return (
    <div className="sticky top-0 z-[35] min-h-12 border-b border-[#f59e0b] bg-[linear-gradient(90deg,#fef3c7_0%,#fde68a_100%)] px-4 py-2 text-[#78350f]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 text-center text-sm font-semibold">
        <AlertTriangle aria-hidden="true" size={16} strokeWidth={1.8} />
        <span>{banner.message}</span>
        <Link
          href={banner.ctaHref}
          className="text-xs font-bold underline underline-offset-4"
        >
          {banner.ctaLabel}
        </Link>
      </div>
    </div>
  );
}

function getAccountBanner(
  user: SkillsetUser,
  profile: UserProfile | null,
): BannerState | null {
  if (user.emailVerified === false) {
    return {
      message: "Verify your email to unlock all features.",
      ctaLabel: "Resend verification",
      ctaHref: "/account/security",
    };
  }

  if (user.roles.includes("teacher") && !profile?.teacherTermsAcceptedAt) {
    return {
      message: "Accept Teacher Terms to publish courses.",
      ctaLabel: "Accept terms",
      ctaHref: "/legal/teacher-terms",
    };
  }

  if (user.roles.includes("teacher") && !profile?.stripeConnectChargesEnabled) {
    return {
      message: "Complete Stripe setup to accept payments.",
      ctaLabel: "Complete setup",
      ctaHref: "/account/payments",
    };
  }

  return null;
}
