import type { Metadata } from "next";

import Link from "next/link";

import { ShieldX, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
	title: "Error",
	description: "Expired verification link",
};

export default function Error() {
	return (
		<div className="flex h-screen w-full items-center justify-center bg-muted/40">
			<div className="h-full flex flex-col items-center justify-center">
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
					<ShieldX className="w-10 h-10" />
				</div>
				<h2 className="text-2xl font-semibold mt-6">Unable to sign in</h2>
				<p className="text-muted-foreground text-sm mt-2 text-center">
					Your email verification link has expired. Please request a new link.
				</p>
				<div className="mt-6">
					<Button asChild>
						<Link href="/signin">
							<ChevronLeft className="w-4 h-4 mr-2" />
							Back
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
