import { Hero } from "@/components/marketing/hero";
import { FeaturesSection } from "@/components/marketing/features-section";
import { StatsSection } from "@/components/marketing/stats-section";
import { CTASection } from "@/components/marketing/cta-section";

export default function MarketingPage() {
	return (
		<>
			<Hero />
			<FeaturesSection />
			<StatsSection />
			<CTASection />
		</>
	);
}
