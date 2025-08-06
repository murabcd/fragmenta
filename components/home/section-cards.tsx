"use client";

import {
	Users,
	TrendingUp,
	TrendingDown,
	Eye,
	FileText,
	MoveRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useWorkspace } from "@/hooks/use-workspace";

export function SectionCards() {
	const { workspace } = useWorkspace();

	// Fetch real data for marketing metrics
	const forms = useQuery(
		api.forms.getFormsByWorkspace,
		workspace?._id ? { orgId: workspace._id } : "skip",
	);

	const responseStats = useQuery(
		api.forms.getFormResponseStats,
		workspace?._id ? { orgId: workspace._id } : "skip",
	);

	// Calculate marketing metrics
	const totalForms = forms?.length || 0;
	const publishedForms = forms?.filter((form) => form.isPublished).length || 0;

	// Calculate total responses across all forms
	const totalResponses = responseStats
		? Object.values(responseStats.responseStats).reduce(
				(total, dailyResponses) => {
					return (
						total +
						Object.values(dailyResponses).reduce((sum, count) => sum + count, 0)
					);
				},
				0,
			)
		: 0;

	// Calculate response rate (responses per published form)
	const responseRate =
		publishedForms > 0
			? Math.round((totalResponses / publishedForms) * 100) / 100
			: 0;

	// Calculate trends based on recent vs previous period data
	const calculateTrend = (current: number, previous: number) => {
		if (previous === 0) return current > 0 ? 100 : 0;
		return Math.round(((current - previous) / previous) * 100);
	};

	// Calculate trends for different metrics
	const getFormTrend = () => {
		if (!responseStats?.forms) return { trend: 0, isPositive: true };

		const now = new Date();
		const currentPeriod = responseStats.forms.filter((form) => {
			const formDate = new Date(form._creationTime);
			const daysDiff =
				(now.getTime() - formDate.getTime()) / (1000 * 60 * 60 * 24);
			return daysDiff <= 7; // Last 7 days
		}).length;

		const previousPeriod = responseStats.forms.filter((form) => {
			const formDate = new Date(form._creationTime);
			const daysDiff =
				(now.getTime() - formDate.getTime()) / (1000 * 60 * 60 * 24);
			return daysDiff > 7 && daysDiff <= 14; // 7-14 days ago
		}).length;

		const trend = calculateTrend(currentPeriod, previousPeriod);
		return { trend, isPositive: trend >= 0 };
	};

	const getResponseTrend = () => {
		if (!responseStats?.responseStats) return { trend: 0, isPositive: true };

		const now = new Date();
		const currentPeriodResponses = Object.values(
			responseStats.responseStats,
		).reduce((total, dailyResponses) => {
			return (
				total +
				Object.entries(dailyResponses).reduce((sum, [date, count]) => {
					const responseDate = new Date(date);
					const daysDiff =
						(now.getTime() - responseDate.getTime()) / (1000 * 60 * 60 * 24);
					return sum + (daysDiff <= 7 ? count : 0);
				}, 0)
			);
		}, 0);

		const previousPeriodResponses = Object.values(
			responseStats.responseStats,
		).reduce((total, dailyResponses) => {
			return (
				total +
				Object.entries(dailyResponses).reduce((sum, [date, count]) => {
					const responseDate = new Date(date);
					const daysDiff =
						(now.getTime() - responseDate.getTime()) / (1000 * 60 * 60 * 24);
					return sum + (daysDiff > 7 && daysDiff <= 14 ? count : 0);
				}, 0)
			);
		}, 0);

		const trend = calculateTrend(
			currentPeriodResponses,
			previousPeriodResponses,
		);
		return { trend, isPositive: trend >= 0 };
	};

	const getPublishedTrend = () => {
		if (!responseStats?.forms) return { trend: 0, isPositive: true };

		const now = new Date();
		const currentPeriod = responseStats.forms.filter((form) => {
			const formDate = new Date(form._creationTime);
			const daysDiff =
				(now.getTime() - formDate.getTime()) / (1000 * 60 * 60 * 24);
			return daysDiff <= 7 && form.isPublished;
		}).length;

		const previousPeriod = responseStats.forms.filter((form) => {
			const formDate = new Date(form._creationTime);
			const daysDiff =
				(now.getTime() - formDate.getTime()) / (1000 * 60 * 60 * 24);
			return daysDiff > 7 && daysDiff <= 14 && form.isPublished;
		}).length;

		const trend = calculateTrend(currentPeriod, previousPeriod);
		return { trend, isPositive: trend >= 0 };
	};

	const getResponseRateTrend = () => {
		const responseTrend = getResponseTrend();
		const publishedTrend = getPublishedTrend();

		// Simplified trend calculation for response rate
		const trend = Math.round((responseTrend.trend + publishedTrend.trend) / 2);
		return { trend, isPositive: trend >= 0 };
	};

	const formTrend = getFormTrend();
	const responseTrend = getResponseTrend();
	const publishedTrend = getPublishedTrend();
	const responseRateTrend = getResponseRateTrend();

	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Total forms</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						{totalForms}
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<FileText />
							{publishedForms} published
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						{formTrend.trend === 0 ? (
							<MoveRight className="size-4" />
						) : formTrend.isPositive ? (
							<TrendingUp className="size-4" />
						) : (
							<TrendingDown className="size-4" />
						)}
						{formTrend.trend}% this week
					</div>
					<div className="text-muted-foreground">Forms in your workspace</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Total responses</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						{totalResponses}
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<Users />
							{responseRate} avg/form
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						{responseTrend.trend === 0 ? (
							<MoveRight className="size-4" />
						) : responseTrend.isPositive ? (
							<TrendingUp className="size-4" />
						) : (
							<TrendingDown className="size-4" />
						)}
						{responseTrend.trend}% this week
					</div>
					<div className="text-muted-foreground">
						Total responses across all forms
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Published forms</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						{publishedForms}
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<Eye />
							{totalForms > 0
								? Math.round((publishedForms / totalForms) * 100)
								: 0}
							%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						{publishedTrend.trend === 0 ? (
							<MoveRight className="size-4" />
						) : publishedTrend.isPositive ? (
							<TrendingUp className="size-4" />
						) : (
							<TrendingDown className="size-4" />
						)}
						{publishedTrend.trend}% this week
					</div>
					<div className="text-muted-foreground">Forms available to users</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Response rate</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						{responseRate}
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<TrendingUp />
							per form
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						{responseRateTrend.trend === 0 ? (
							<MoveRight className="size-4" />
						) : responseRateTrend.isPositive ? (
							<TrendingUp className="size-4" />
						) : (
							<TrendingDown className="size-4" />
						)}
						{responseRateTrend.trend}% this week
					</div>
					<div className="text-muted-foreground">
						Responses per published form
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
