import Link from "next/link";
import Image from "next/image";
import {
	Zap,
	Users,
	Calendar,
	Palette,
	BarChart3,
	Link as LinkIcon,
	Globe,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const primaryFeatures = [
	{
		name: "AI-powered insights",
		description:
			"Get intelligent insights from your form responses with our advanced AI analysis. Understand your audience better with automated sentiment analysis and trend detection.",
		href: "#",
		icon: Zap,
	},
	{
		name: "Real-time collaboration",
		description:
			"Work together with your team in real-time. Share forms, edit questions simultaneously, and see changes as they happen with our collaborative editing features.",
		href: "#",
		icon: Users,
	},
	{
		name: "Advanced scheduling",
		description:
			"Schedule form publications, set up automated reminders, and manage response collection with our powerful scheduling and automation tools.",
		href: "#",
		icon: Calendar,
	},
];

const secondaryFeatures = [
	{
		name: "Drag & drop builder",
		description:
			"Create beautiful forms with our intuitive drag-and-drop interface. No coding required.",
		icon: Palette,
	},
	{
		name: "Google Sheets integration",
		description:
			"Automatically sync responses to Google Sheets for easy data analysis and reporting.",
		icon: BarChart3,
	},
	{
		name: "Custom branding",
		description:
			"Add your logo, colors, and custom styling to match your brand perfectly.",
		icon: Palette,
	},
	{
		name: "Advanced analytics",
		description:
			"Get detailed insights into form performance, completion rates, and user behavior.",
		icon: BarChart3,
	},
	{
		name: "Webhook support",
		description:
			"Integrate with your existing tools and workflows with our comprehensive webhook system.",
		icon: LinkIcon,
	},
	{
		name: "Multi-language support",
		description:
			"Create forms in multiple languages and reach a global audience with ease.",
		icon: Globe,
	},
];

export function FeaturesSection() {
	return (
		<>
			{/* Primary Features */}
			<div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
				<div className="mx-auto max-w-2xl lg:text-center">
					<h2 className="text-base/7 font-semibold text-primary">
						Build faster
					</h2>
					<p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-foreground sm:text-5xl lg:text-balance">
						Everything you need to create amazing forms
					</p>
					<p className="mt-6 text-lg/8 text-muted-foreground">
						From simple surveys to complex marketing campaigns, Fragmenta
						provides all the tools you need to collect data efficiently and gain
						meaningful insights.
					</p>
				</div>
				<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
					<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
						{primaryFeatures.map((feature) => (
							<Card
								key={feature.name}
								className="bg-card border-border shadow-lg"
							>
								<CardContent className="p-6">
									<div className="flex flex-col h-full">
										<dt className="text-base/7 font-semibold text-foreground">
											<div className="mb-6 flex size-12 items-center justify-center rounded-full bg-primary/10">
												<feature.icon
													aria-hidden="true"
													className="size-6 text-primary"
												/>
											</div>
											{feature.name}
										</dt>
										<dd className="mt-1 flex flex-auto flex-col text-base/7 text-muted-foreground">
											<p className="flex-auto">{feature.description}</p>
											<p className="mt-6">
												<Link
													href={feature.href}
													className="text-sm/6 font-semibold text-primary hover:text-primary/80"
												>
													Learn more <span aria-hidden="true">→</span>
												</Link>
											</p>
										</dd>
									</div>
								</CardContent>
							</Card>
						))}
					</dl>
				</div>
			</div>

			{/* Secondary Features */}
			<div className="mt-32 sm:mt-56">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl sm:text-center">
						<h2 className="text-base/7 font-semibold text-primary">
							Everything you need
						</h2>
						<p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-foreground sm:text-5xl sm:text-balance">
							Design forms. Not code.
						</p>
						<p className="mt-6 text-lg/8 text-muted-foreground">
							Our intuitive interface makes form creation accessible to
							everyone, from marketers to product managers.
						</p>
					</div>
				</div>

				<div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
					<dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base/7 text-muted-foreground sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
						{secondaryFeatures.map((feature) => (
							<div key={feature.name} className="relative pl-9">
								<dt className="inline font-semibold text-foreground">
									<feature.icon className="absolute top-1 left-1 size-5 text-primary" />
									{feature.name}
								</dt>{" "}
								<dd className="inline">{feature.description}</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</>
	);
}
