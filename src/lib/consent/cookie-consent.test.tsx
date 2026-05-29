import { beforeEach, describe, expect, it } from "vitest";

import {
  getStoredCookieConsent,
  hasAnalyticsConsent,
  setStoredCookieConsent,
} from "@/lib/consent/cookie-consent";

const STORAGE_KEY = "skillset.cookie-consent.v1";

describe("cookie consent store", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when no decision has been made", () => {
    expect(getStoredCookieConsent()).toBeNull();
  });

  it("treats an undecided visitor as having analytics consent (opt-out model)", () => {
    expect(hasAnalyticsConsent()).toBe(true);
  });

  it("persists and reads an 'accepted' decision", () => {
    setStoredCookieConsent("accepted");

    expect(getStoredCookieConsent()).toBe("accepted");
    expect(hasAnalyticsConsent()).toBe(true);
  });

  it("persists and reads a 'rejected' decision and revokes analytics consent", () => {
    setStoredCookieConsent("rejected");

    expect(getStoredCookieConsent()).toBe("rejected");
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("ignores a corrupted stored value", () => {
    window.localStorage.setItem(STORAGE_KEY, "garbage");

    expect(getStoredCookieConsent()).toBeNull();
    expect(hasAnalyticsConsent()).toBe(true);
  });
});
