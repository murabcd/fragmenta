import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";

export const Footer = () => {
	return (
		<footer className="relative isolate overflow-hidden bg-background">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<Separator className="my-12" />
				<div className="py-12 md:flex md:items-center md:justify-between">
					<p className="mt-8 text-center text-sm/6 text-muted-foreground md:order-1 md:mt-0">
						&copy; 2024 Fragmenta, Inc. All rights reserved.
					</p>
					<div className="flex justify-center gap-x-6 md:order-2 md:ml-8 mt-4 md:mt-0">
						<a
							href="https://github.com/muradpm/fragmenta"
							className="text-muted-foreground hover:text-foreground transition-colors"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span className="sr-only">GitHub</span>
							<Icons.github className="size-6" />
						</a>
						<a
							href="https://linkedin.com/company/fragmentainc/"
							className="text-muted-foreground hover:text-foreground transition-colors"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span className="sr-only">LinkedIn</span>
							<Icons.linkedin className="size-6" />
						</a>
						<a
							href="https://x.com/fragmentainc"
							className="text-muted-foreground hover:text-foreground transition-colors"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span className="sr-only">X (Twitter)</span>
							<Icons.x className="size-6" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};
