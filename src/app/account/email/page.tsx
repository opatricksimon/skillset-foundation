import { redirect } from "next/navigation";

export default function AccountEmailPage() {
  redirect("/account?tab=security");
}
