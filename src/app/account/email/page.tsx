import { redirect } from "next/navigation";

export default function AccountEmailPage() {
  // The login-email / verification view lives in the "account" tab
  // (AccountIdentityPanel); "security" is password/MFA only.
  redirect("/account?tab=account");
}
