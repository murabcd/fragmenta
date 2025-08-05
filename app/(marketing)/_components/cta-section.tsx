import Link from "next/link";

import { Button } from "@/components/ui/button";

export const CTASection = () => {
	return (
		<div className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8">
			<svg
				aria-hidden="true"
				className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-muted/10"
			>
				<defs>
					<pattern
						x="50%"
						y={0}
						id="1d4240dd-898f-445f-932d-e2872fd12de3"
						width={200}
						height={200}
						patternUnits="userSpaceOnUse"
					>
						<path d="M.5 200V.5H200" fill="none" />
					</pattern>
				</defs>
				<svg
					x="50%"
					y={0}
					className="overflow-visible fill-muted/20"
					aria-hidden="true"
				>
					<path
						d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
						strokeWidth={0}
					/>
				</svg>
				<rect
					fill="url(#1d4240dd-898f-445f-932d-e2872fd12de3)"
					width="100%"
					height="100%"
					strokeWidth={0}
				/>
			</svg>
			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
			>
				<div
					style={{
						clipPath:
							"polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
					}}
					className="aspect-1108/632 w-277 flex-none bg-gradient-to-r from-primary to-primary/60 opacity-20"
				/>
			</div>
			<div className="mx-auto max-w-2xl text-center">
				<h2 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
					Boost your marketing. Start using Fragmenta today.
				</h2>
				<p className="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-muted-foreground">
					Join thousands of marketers who are already using Fragmenta to collect
					data, gain insights, and make better decisions.
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<Link href="/register">
						<Button className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
							Get started
						</Button>
					</Link>
					<Link
						href="/about"
						className="text-sm/6 font-semibold text-foreground"
					>
						Learn more <span aria-hidden="true">→</span>
					</Link>
				</div>
			</div>
		</div>
	);
};
