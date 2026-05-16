import { CapabilitiesGrid } from "@/components/site/capabilities-grid";
import { ForCreatorsBand } from "@/components/site/for-creators-band";
import { HowItWorksStrip } from "@/components/site/how-it-works-strip";
import { MarketingHero } from "@/components/site/marketing-hero";
import { PromisePreviewBand } from "@/components/site/promise-preview-band";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: "International marketplace for professional courses",
  description:
    "Skillset is the international marketplace where independent experts publish reviewed courses with course communities, live sessions, and verifiable certificates.",
  path: "/",
});

export default function Home() {
  return (
    <div className="page-shell">
      <SiteNav />
      <MarketingHero />
      <HowItWorksStrip />
      <CapabilitiesGrid />
      <PromisePreviewBand />
      <ForCreatorsBand />
      <SiteFooter />
    </div>
  );
}
