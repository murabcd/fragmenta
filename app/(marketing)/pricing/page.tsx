"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const frequencies = [
	{ value: "monthly", label: "Monthly" },
	{ value: "annually", label: "Annually" },
];

const tiers = [
	{
		name: "Free",
		id: "tier-free",
		href: "/register",
		featured: false,
		description: "Perfect for getting started.",
		price: { monthly: "$0", annually: "$0" },
		highlights: [
			"Unlimited forms",
			"Unlimited responses",
			"Basic analytics",
			"Google Sheets integration",
			"Community support",
		],
	},
	{
		name: "Pro",
		id: "tier-pro",
		href: "/register",
		featured: true,
		description: "Everything you need to scale.",
		price: { monthly: "$29", annually: "$290" },
		highlights: [
			"Everything in Free",
			"Advanced analytics",
			"Custom branding",
			"Webhook support",
			"Priority support",
			"Team collaboration",
		],
	},
	{
		name: "Enterprise",
		id: "tier-enterprise",
		href: "/register",
		featured: false,
		description: "For large teams and workspaces.",
		price: { monthly: "$99", annually: "$990" },
		highlights: [
			"Everything in Pro",
			"Unlimited team members",
			"SSO integration",
			"Advanced security",
			"Dedicated support",
			"Custom integrations",
		],
	},
];

const sections = [
	{
		name: "Forms & Responses",
		features: [
			{
				name: "Forms per month",
				tiers: { Free: "Unlimited", Pro: "Unlimited", Enterprise: "Unlimited" },
			},
			{
				name: "Responses per month",
				tiers: { Free: "1,000", Pro: "10,000", Enterprise: "Unlimited" },
			},
			{
				name: "Custom domains",
				tiers: { Free: false, Pro: true, Enterprise: true },
			},
			{
				name: "File uploads",
				tiers: { Free: false, Pro: true, Enterprise: true },
			},
		],
	},
	{
		name: "Analytics & Insights",
		features: [
			{
				name: "Basic analytics",
				tiers: { Free: true, Pro: true, Enterprise: true },
			},
			{
				name: "Advanced analytics",
				tiers: { Free: false, Pro: true, Enterprise: true },
			},
			{
				name: "AI-powered insights",
				tiers: { Free: false, Pro: true, Enterprise: true },
			},
			{
				name: "Custom reports",
				tiers: { Free: false, Pro: false, Enterprise: true },
			},
		],
	},
	{
		name: "Team & Collaboration",
		features: [
			{
				name: "Team members",
				tiers: { Free: "1", Pro: "5", Enterprise: "Unlimited" },
			},
			{
				name: "Real-time collaboration",
				tiers: { Free: false, Pro: true, Enterprise: true },
			},
			{
				name: "Role-based permissions",
				tiers: { Free: false, Pro: true, Enterprise: true },
			},
			{
				name: "SSO integration",
				tiers: { Free: false, Pro: false, Enterprise: true },
			},
		],
	},
	{
		name: "Integrations & Support",
		features: [
			{
				name: "Google Sheets",
				tiers: { Free: true, Pro: true, Enterprise: true },
			},
			{
				name: "Webhook support",
				tiers: { Free: false, Pro: true, Enterprise: true },
			},
			{
				name: "API access",
				tiers: { Free: false, Pro: true, Enterprise: true },
			},
			{
				name: "Priority support",
				tiers: { Free: false, Pro: true, Enterprise: true },
			},
		],
	},
];

export default function PricingPage() {
	const [frequency, setFrequency] = useState("annually");

	return (
		<div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
			<div className="mx-auto max-w-2xl text-center">
				<h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
					Pricing that{" "}
					<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
						grows with you
					</span>
				</h1>
				<p className="mt-6 text-lg text-muted-foreground">
					Choose an affordable plan that's packed with the best features for
					collecting data, gaining insights, and making better decisions.
				</p>
				<div className="mt-10 flex justify-center">
					<div className="inline-flex rounded-lg bg-muted p-1">
						{frequencies.map((freq) => (
							<Button
								key={freq.value}
								variant={frequency === freq.value ? "default" : "ghost"}
								size="sm"
								onClick={() => setFrequency(freq.value)}
								className="rounded-md"
							>
								{freq.label}
							</Button>
						))}
					</div>
				</div>
			</div>

			<div className="mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
				{tiers.map((tier) => (
					<Card
						key={tier.id}
						className={`relative ${
							tier.featured ? "border-primary shadow-lg" : ""
						}`}
					>
						<CardHeader className="text-center">
							{tier.featured && (
								<div className="absolute -top-3 left-1/2 -translate-x-1/2">
									<Badge variant="default">Most Popular</Badge>
								</div>
							)}
							<CardTitle className="text-xl">{tier.name}</CardTitle>
							<CardDescription>{tier.description}</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="text-center">
								<div className="flex items-center justify-center gap-x-2">
									<span className="text-4xl font-bold">
										{frequency === "monthly"
											? tier.price.monthly
											: tier.price.annually}
									</span>
									<div className="text-sm text-muted-foreground">
										<div>USD</div>
									</div>
								</div>
							</div>

							<ul className="space-y-3 text-sm">
								{tier.highlights.map((feature) => (
									<li key={feature} className="flex items-center gap-x-3">
										<Check className="h-4 w-4 text-primary flex-shrink-0" />
										<span className="text-muted-foreground">{feature}</span>
									</li>
								))}
							</ul>

							<Button asChild className="w-full">
								<Link href={tier.href}>
									{tier.name === "Free"
										? "Get started"
										: tier.name === "Pro"
											? "Choose plan"
											: "Contact sales"}
								</Link>
							</Button>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Feature comparison */}
			<div className="mt-24">
				<h2 className="text-2xl font-semibold text-center mb-12">
					Feature comparison
				</h2>
				<div className="space-y-12">
					{sections.map((section) => (
						<div key={section.name}>
							<h3 className="text-lg font-semibold mb-6">{section.name}</h3>
							<Card>
								<CardContent className="p-6">
									<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
										<div className="lg:col-span-1">
											<div className="text-sm font-medium text-muted-foreground">
												Features
											</div>
										</div>
										{tiers.map((tier) => (
											<div key={tier.id} className="text-center">
												<div className="text-sm font-medium">{tier.name}</div>
											</div>
										))}
										{section.features.map((feature) => (
											<React.Fragment key={feature.name}>
												<div className="lg:col-span-1">
													<div className="text-sm text-muted-foreground">
														{feature.name}
													</div>
												</div>
												{tiers.map((tier) => (
													<div key={tier.id} className="text-center">
														{typeof feature.tiers[
															tier.name as keyof typeof feature.tiers
														] === "string" ? (
															<span className="text-sm font-medium">
																{
																	feature.tiers[
																		tier.name as keyof typeof feature.tiers
																	]
																}
															</span>
														) : (
															<>
																{feature.tiers[
																	tier.name as keyof typeof feature.tiers
																] === true ? (
																	<Check className="mx-auto h-4 w-4 text-primary" />
																) : (
																	<X className="mx-auto h-4 w-4 text-muted-foreground" />
																)}
															</>
														)}
													</div>
												))}
											</React.Fragment>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					))}
				</div>
			</div>

			<div className="mx-auto mt-16 max-w-2xl text-center">
				<p className="text-sm text-muted-foreground">
					Questions about pricing?{" "}
					<Link
						href="mailto:murad@fragmenta.ai"
						className="text-primary hover:text-primary/80"
					>
						Contact us
					</Link>
				</p>
			</div>
		</div>
	);
}
