"use client";

import { SquareArrowOutUpRight, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BillingFormProps extends React.HTMLAttributes<HTMLFormElement> {}

export const BillingForm = ({ className, ...props }: BillingFormProps) => {
	return (
		<form className="space-y-8" {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-lg font-medium">Billing</CardTitle>
					<CardDescription>
						Manage billing and your subscription plan.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Alert>
						<Info className="h-4 w-4" />
						<AlertTitle>Free while in beta</AlertTitle>
						<AlertDescription>
							<p className="mt-2 text-xs text-muted-foreground">
								If you have any questions leave as a
								<span className="inline-flex items-center ml-1">
									<a
										className="text-blue-500 hover:underline flex items-center"
										href="mailto:murad@fragmenta.ai"
									>
										message
										<SquareArrowOutUpRight className="w-3 h-3 ml-1" />
									</a>
								</span>
							</p>
						</AlertDescription>
					</Alert>
				</CardContent>
				<CardFooter className="border-t justify-end">
					<Button type="submit" disabled>
						Upgrade
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
};
