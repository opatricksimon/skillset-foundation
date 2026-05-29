import { describe, expect, it } from "vitest";

import { getSafeExternalUrl } from "@/domain/external-url";

describe("getSafeExternalUrl", () => {
  it("accepts absolute http(s) URLs and returns them trimmed", () => {
    expect(getSafeExternalUrl("https://zoom.us/j/123")).toBe("https://zoom.us/j/123");
    expect(getSafeExternalUrl("  https://meet.google.com/abc-defg  ")).toBe(
      "https://meet.google.com/abc-defg",
    );
    expect(getSafeExternalUrl("http://example.com/live")).toBe(
      "http://example.com/live",
    );
  });

  it("rejects empty, null, and non-URL values", () => {
    expect(getSafeExternalUrl(null)).toBeNull();
    expect(getSafeExternalUrl(undefined)).toBeNull();
    expect(getSafeExternalUrl("")).toBeNull();
    expect(getSafeExternalUrl("   ")).toBeNull();
    expect(getSafeExternalUrl("not a url")).toBeNull();
    expect(getSafeExternalUrl("zoom.us/j/123")).toBeNull();
  });

  it("rejects dangerous schemes (stored-XSS vectors)", () => {
    expect(getSafeExternalUrl("javascript:alert(1)")).toBeNull();
    expect(getSafeExternalUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(getSafeExternalUrl("vbscript:msgbox(1)")).toBeNull();
    expect(getSafeExternalUrl("file:///etc/passwd")).toBeNull();
  });
});
