import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const nextParams = new URLSearchParams({ mode: "signin" });
  const path = firstParam(params.path);
  const role = firstParam(params.role);

  if (path) {
    nextParams.set("path", path);
  }

  if (role) {
    nextParams.set("role", role);
  }

  redirect(`/auth?${nextParams.toString()}`);
}
