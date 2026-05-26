import { redirect } from "next/navigation";

export default function LearnSettingsPage() {
  redirect("/account?tab=profile");
}
