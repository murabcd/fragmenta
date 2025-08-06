import { Button } from "@/components/ui/button";

import { ShieldAlert, ChevronLeft } from "lucide-react";

import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex h-screen w-full items-center justify-center bg-muted/40">
			<div className="h-full flex flex-col items-center justify-center">
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
					<ShieldAlert className="w-10 h-10" />
				</div>
				<h2 className="text-2xl font-semibold mt-6">Form not found</h2>
				<p className="text-muted-foreground text-sm mt-2">
					It seems like the form you&apos;re looking for does not exist.
				</p>
				<div className="mt-6">
					<Button asChild>
						<Link href="/">
							<ChevronLeft className="w-4 h-4 mr-2" />
							Back
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
