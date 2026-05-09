import { FeaturedTracks } from "@/components/site/featured-tracks";
import { InstructorShowcase } from "@/components/site/instructor-showcase";
import { MarketingHero } from "@/components/site/marketing-hero";
import { SiteNav } from "@/components/site/site-nav";
import { WaitlistBand } from "@/components/site/waitlist-band";

export default function Home() {
  return (
    <div className="page-shell">
      <SiteNav />
      <MarketingHero />
      <FeaturedTracks />
      <InstructorShowcase />
      <WaitlistBand />
    </div>
  );
}
