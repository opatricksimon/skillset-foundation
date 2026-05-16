import { notFound } from "next/navigation";

// No real instructors are published yet. Until verified instructors
// (teachers with published courses) exist, no instructor detail page
// should resolve — the listing shows an honest empty state and direct
// URLs return 404 instead of fabricated profiles.
export function generateStaticParams(): { slug: string }[] {
  return [];
}

export default function InstructorDetailPage() {
  notFound();
}
