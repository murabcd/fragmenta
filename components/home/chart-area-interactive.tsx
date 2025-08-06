"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useWorkspace } from "@/hooks/use-workspace";

export const description = "An interactive area chart";

const chartConfig = {
	visitors: {
		label: "Submissions",
	},
	desktop: {
		label: "Published",
		color: "var(--primary)",
	},
	mobile: {
		label: "Completed",
		color: "var(--primary)",
	},
} satisfies ChartConfig;

export function ChartAreaInteractive() {
	const isMobile = useIsMobile();
	const { workspace } = useWorkspace();
	const [timeRange, setTimeRange] = React.useState("7d");

	// Fetch real form response data
	const responseStats = useQuery(
		api.forms.getFormResponseStats,
		workspace?._id ? { orgId: workspace._id } : "skip",
	);

	React.useEffect(() => {
		if (isMobile) {
			setTimeRange("7d");
		}
	}, [isMobile]);

	// Generate chart data from real form submissions
	const chartData = React.useMemo(() => {
		if (!responseStats) return [];

		const now = new Date();
		const daysToShow = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
		const data = [];

		for (let i = daysToShow - 1; i >= 0; i--) {
			const date = new Date(now);
			date.setDate(date.getDate() - i);
			const dateStr = date.toISOString().split("T")[0];

			// Count published forms created on this date
			const publishedForms = responseStats.forms.filter((form) => {
				const formDate = new Date(form._creationTime)
					.toISOString()
					.split("T")[0];
				return formDate === dateStr && form.isPublished;
			}).length;

			// Count completed forms (forms with responses) for this date
			let completedForms = 0;
			Object.entries(responseStats.responseStats).forEach(
				([formId, formResponses]) => {
					if (formResponses[dateStr] && formResponses[dateStr] > 0) {
						completedForms++;
					}
				},
			);

			data.push({
				date: dateStr,
				desktop: publishedForms, // Published forms
				mobile: completedForms, // Completed forms (with responses)
			});
		}

		return data;
	}, [responseStats, timeRange]);

	if (responseStats === undefined) {
		return (
			<Card className="@container/card">
				<CardHeader>
					<CardTitle>Form submissions</CardTitle>
					<CardDescription>Loading...</CardDescription>
				</CardHeader>
				<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
					<div className="aspect-auto h-[250px] w-full flex items-center justify-center">
						<div className="text-muted-foreground">Loading chart data...</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="@container/card">
			<CardHeader>
				<CardTitle>Form submissions</CardTitle>
				<CardDescription>
					<span className="hidden @[540px]/card:block">
						Published forms vs completed forms for the selected period
					</span>
					<span className="@[540px]/card:hidden">Form activity</span>
				</CardDescription>
				<CardAction>
					<ToggleGroup
						type="single"
						value={timeRange}
						onValueChange={setTimeRange}
						variant="outline"
						className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
					>
						<ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
						<ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
						<ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
					</ToggleGroup>
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger
							className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
							size="sm"
							aria-label="Select a value"
						>
							<SelectValue placeholder="Last 7 days" />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value="90d" className="rounded-lg">
								Last 3 months
							</SelectItem>
							<SelectItem value="30d" className="rounded-lg">
								Last 30 days
							</SelectItem>
							<SelectItem value="7d" className="rounded-lg">
								Last 7 days
							</SelectItem>
						</SelectContent>
					</Select>
				</CardAction>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart data={chartData}>
						<defs>
							<linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-desktop)"
									stopOpacity={1.0}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-desktop)"
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-mobile)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-mobile)"
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										});
									}}
									indicator="dot"
								/>
							}
						/>
						<Area
							dataKey="mobile"
							type="natural"
							fill="url(#fillMobile)"
							stroke="var(--color-mobile)"
							stackId="a"
						/>
						<Area
							dataKey="desktop"
							type="natural"
							fill="url(#fillDesktop)"
							stroke="var(--color-desktop)"
							stackId="a"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
