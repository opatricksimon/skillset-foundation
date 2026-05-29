/**
 * Returns the trimmed URL only when it is a syntactically valid absolute
 * http(s) URL; otherwise null.
 *
 * Use this to gate ANY `href` built from user/teacher-controlled input (course
 * event links, lesson external links). Firestore rules only check length, so a
 * stored value like `javascript:alert(1)` or `data:...` would otherwise reach
 * the DOM as a clickable link — a stored-XSS / open-redirect vector. Rendering
 * the link only when this returns non-null closes that hole and also avoids
 * broken links from empty/garbage values.
 */
export function getSafeExternalUrl(
  value: string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  try {
    const url = new URL(trimmed);

    return url.protocol === "https:" || url.protocol === "http:"
      ? trimmed
      : null;
  } catch {
    return null;
  }
}
