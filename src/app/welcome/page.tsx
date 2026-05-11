import { WelcomeChoice } from "@/components/auth/welcome-choice";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to Skillset | Skillset",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WelcomePage() {
  return <WelcomeChoice />;
}
