"use client";

import {
	TrendingUp,
	Eye,
	Edit,
	Trash2,
	Calendar,
	Users,
	BarChart3,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Mock chart data - in a real app, this would come from your analytics
const chartData = [
	{ day: "Mon", responses: 12 },
	{ day: "Tue", responses: 19 },
	{ day: "Wed", responses: 8 },
	{ day: "Thu", responses: 15 },
	{ day: "Fri", responses: 22 },
	{ day: "Sat", responses: 18 },
	{ day: "Sun", responses: 14 },
];

const chartConfig = {
	responses: {
		label: "Responses",
		color: "var(--primary)",
	},
} satisfies ChartConfig;

export const schema = z.object({
	_id: z.string(),
	title: z.string(),
	name: z.string(),
	wsId: z.string(),
	isPublished: z.boolean(),
	_creationTime: z.number(),
	responseCount: z.number().optional(),
	lastResponseTime: z.number().optional(),
});

interface FormDetailsDrawerProps {
	item: z.infer<typeof schema>;
	children: React.ReactNode;
}

export function FormDetailsDrawer({ item, children }: FormDetailsDrawerProps) {
	const isMobile = useIsMobile();
	const router = useRouter();
	const { mutate: updateFormTitle } = useApiMutation(api.forms.updateFormTitle);
	const { mutate: updateFormPublishStatus } = useApiMutation(
		api.forms.updateFormPublishStatus,
	);

	const handleTitleUpdate = (newTitle: string) => {
		toast.promise(
			updateFormTitle({
				id: item._id as Id<"forms">,
				title: newTitle,
			}),
			{
				loading: "Updating form title...",
				success: "Form title updated",
				error: "Failed to update form title",
			},
		);
	};

	const handlePublishToggle = (isPublished: boolean) => {
		toast.promise(
			updateFormPublishStatus({
				id: item._id as Id<"forms">,
				isPublished,
			}),
			{
				loading: "Updating form status...",
				success: isPublished ? "Form published" : "Form unpublished",
				error: "Failed to update form status",
			},
		);
	};

	return (
		<Drawer direction={isMobile ? "bottom" : "right"}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="gap-1">
					<DrawerTitle>{item.title}</DrawerTitle>
					<DrawerDescription>
						Form details and response analytics
					</DrawerDescription>
				</DrawerHeader>
				<div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
					{!isMobile && (
						<>
							<ChartContainer config={chartConfig}>
								<AreaChart
									accessibilityLayer
									data={chartData}
									margin={{
										left: 0,
										right: 10,
									}}
								>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="day"
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										hide
									/>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent indicator="dot" />}
									/>
									<Area
										dataKey="responses"
										type="natural"
										fill="var(--color-responses)"
										fillOpacity={0.6}
										stroke="var(--color-responses)"
									/>
								</AreaChart>
							</ChartContainer>
							<Separator />
							<div className="grid gap-2">
								<div className="flex gap-2 leading-none font-medium">
									Response analytics for this form{" "}
									<TrendingUp className="size-4" />
								</div>
								<div className="text-muted-foreground">
									Showing response trends over the last 7 days. This helps track
									form engagement and identify peak response times.
								</div>
							</div>
							<Separator />
						</>
					)}
					<form className="flex flex-col gap-4">
						<div className="flex flex-col gap-3">
							<Label htmlFor="title">Form title</Label>
							<Input
								id="title"
								defaultValue={item.title}
								onBlur={(e) => handleTitleUpdate(e.target.value)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-3">
								<Label htmlFor="status">Status</Label>
								<Select
									defaultValue={item.isPublished ? "published" : "draft"}
									onValueChange={(value) =>
										handlePublishToggle(value === "published")
									}
								>
									<SelectTrigger id="status" className="w-full">
										<SelectValue placeholder="Select a status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="draft">Draft</SelectItem>
										<SelectItem value="published">Published</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="responses">Total responses</Label>
								<div className="flex items-center gap-2">
									<Users className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm font-medium">
										{item.responseCount || 0} responses
									</span>
								</div>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-3">
								<Label htmlFor="created">Created</Label>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">
										{new Date(item._creationTime).toLocaleDateString()}
									</span>
								</div>
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="lastResponse">Last response</Label>
								<div className="flex items-center gap-2">
									<BarChart3 className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">
										{item.lastResponseTime
											? new Date(item.lastResponseTime).toLocaleDateString()
											: "Never"}
									</span>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-3">
							<Label>Quick actions</Label>
							<div className="flex gap-2">
								<Button
									size="sm"
									variant="outline"
									onClick={() => router.push(`/form/${item._id}`)}
								>
									<Eye className="mr-2 h-4 w-4" />
									View form
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => router.push(`/form/${item._id}`)}
								>
									<Edit className="mr-2 h-4 w-4" />
									Edit
								</Button>
							</div>
						</div>
					</form>
				</div>
				<DrawerFooter>
					<Button>Save Changes</Button>
					<DrawerClose asChild>
						<Button variant="ghost">Done</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
