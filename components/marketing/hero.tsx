import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
	return (
		<div className="relative isolate overflow-hidden bg-background">
			<svg
				aria-hidden="true"
				className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-muted/10"
			>
				<defs>
					<pattern
						x="50%"
						y={-1}
						id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
						width={200}
						height={200}
						patternUnits="userSpaceOnUse"
					>
						<path d="M.5 200V.5H200" fill="none" />
					</pattern>
				</defs>
				<svg
					x="50%"
					y={-1}
					className="overflow-visible fill-muted/20"
					aria-hidden="true"
				>
					<path
						d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
						strokeWidth={0}
					/>
				</svg>
				<rect
					fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
					width="100%"
					height="100%"
					strokeWidth={0}
				/>
			</svg>
			<div
				aria-hidden="true"
				className="absolute top-10 left-[calc(50%-4rem)] -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:top-[calc(50%-30rem)] lg:left-48 xl:left-[calc(50%-24rem)]"
			>
				<div
					style={{
						clipPath:
							"polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
					}}
					className="aspect-1108/632 w-277 bg-gradient-to-r from-primary to-primary/60 opacity-20"
				/>
			</div>
			<div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
				<div className="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:pt-8">
					<div className="mt-24 sm:mt-32 lg:mt-16">
						<Link href="#" className="inline-flex space-x-6">
							<span className="rounded-full bg-primary/10 px-3 py-1 text-sm/6 font-semibold text-primary ring-1 ring-primary/25 ring-inset">
								What's new
							</span>
							<span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-muted-foreground">
								<span>Just shipped v1.0</span>
								<ChevronRight
									aria-hidden="true"
									className="size-5 text-muted-foreground"
								/>
							</span>
						</Link>
					</div>
					<h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-foreground sm:text-7xl">
						Create{" "}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
							powerful forms
						</span>{" "}
						with AI-driven insights
					</h1>
					<p className="mt-8 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
						Fragmenta is an open-source Typeform alternative for modern
						marketing teams. Build beautiful forms, collect responses, and get
						insights with our AI-powered platform.
					</p>
					<div className="mt-10 flex items-center gap-x-6">
						<Link href="/register">
							<Button className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
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
				<div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32">
					<div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
						<Image
							src="https://giddy-ladybug-159.convex.cloud/api/storage/817eced1-e65a-4e6d-b017-d758ea9f44cc"
							alt="Fragmenta app preview"
							width={2432}
							height={1442}
							className="w-250 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
