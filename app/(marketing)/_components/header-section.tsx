"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { MobileMainNav } from "@/components/mobile-main-nav";
import { Icons } from "@/components/icons";

import { useScroll } from "@/hooks/use-scroll";

export const HeaderSection = () => {
	const scrolled = useScroll();

	return (
		<header
			className={cn(
				"sticky top-0 z-20 w-full bg-background/60 backdrop-blur-sm transition-all duration-300",
				scrolled && "bg-background/90 backdrop-blur-md",
			)}
		>
			<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
				<Link href="/" className="flex items-center space-x-2 cursor-pointer">
					<Icons.fragmenta className="size-6 text-foreground" />
					<span className="font-semibold text-xl text-foreground">
						Fragmenta
					</span>
				</Link>

				<div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
					<MainNav />
				</div>

				<div className="hidden md:flex space-x-4">
					<Button variant="ghost" asChild>
						<Link
							href="/login"
							className="text-foreground hover:text-foreground/80"
						>
							Log in
						</Link>
					</Button>
					<Button asChild>
						<Link
							href="/register"
							className="bg-primary text-primary-foreground hover:bg-primary/90"
						>
							Sign up
						</Link>
					</Button>
				</div>
				<div className="md:hidden">
					<MobileMainNav />
				</div>
			</div>
		</header>
	);
};
