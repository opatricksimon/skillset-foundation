import { redirect } from "next/navigation";

export default function AccountEmailPage() {
  // Login email, verification, and change-email now live in the Security tab
  // alongside password + recovery (the standalone Account tab was removed for
  // being a pure pass-through to Security).
  redirect("/account?tab=security");
}
