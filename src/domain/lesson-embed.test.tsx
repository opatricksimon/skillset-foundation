import { describe, expect, it } from "vitest";

import { getTrustedLessonEmbed } from "./lesson-embed";

describe("trusted lesson embeds", () => {
  it("converts YouTube watch, short, and embed links to no-cookie embed URLs", () => {
    expect(getTrustedLessonEmbed("https://www.youtube.com/watch?v=dQw4w9WgXcQ"))
      .toMatchObject({
        provider: "youtube",
        embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      });
    expect(getTrustedLessonEmbed("https://youtu.be/dQw4w9WgXcQ")?.embedUrl).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
    expect(getTrustedLessonEmbed("https://www.youtube.com/shorts/dQw4w9WgXcQ")?.embedUrl)
      .toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  it("converts Vimeo links to player embeds", () => {
    expect(getTrustedLessonEmbed("https://vimeo.com/123456789")).toMatchObject({
      provider: "vimeo",
      embedUrl: "https://player.vimeo.com/video/123456789",
    });
  });

  it("rejects untrusted or malformed embeds", () => {
    expect(getTrustedLessonEmbed("javascript:alert(1)")).toBeNull();
    expect(getTrustedLessonEmbed("https://example.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(getTrustedLessonEmbed("")).toBeNull();
  });
});
