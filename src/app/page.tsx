import { CapabilitiesGrid } from "@/components/site/capabilities-grid";
import { ForCreatorsBand } from "@/components/site/for-creators-band";
import { HowItWorksStrip } from "@/components/site/how-it-works-strip";
import { MarketingHero } from "@/components/site/marketing-hero";
import { PromisePreviewBand } from "@/components/site/promise-preview-band";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";

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
