"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const platform = {
	title: "Platform",
	items: [{ title: "About", href: "/about" }],
};

const solutions = {
	title: "Solutions",
	items: [
		{
			title: "Open source",
			href: "https://github.com/muradpm/fragmenta-ai",
		},
		{
			title: "Discord community",
			href: "https://discord.gg/fragmenta",
		},
	],
};

export const MobileMainNav = () => {
	const [open, setOpen] = React.useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu className="size-6" />
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:w-[400px] p-0">
				<div className="flex justify-between items-center p-4">
					<Link
						href="/"
						className="flex items-center"
						onClick={() => setOpen(false)}
					>
						<Image
							src="/logo.svg"
							alt="logo"
							height={24}
							width={24}
							className="dark:hidden mr-2"
						/>
						<Image
							src="/logo-dark.svg"
							alt="logo"
							height={24}
							width={24}
							className="hidden dark:block mr-2"
						/>
						<span className="font-semibold text-xl">Fragmenta</span>
					</Link>
				</div>
				<nav className="flex flex-col p-4">
					{platform.items.map((subItem) => (
						<Link
							key={subItem.title}
							href={subItem.href}
							className="py-2 text-sm"
							onClick={() => setOpen(false)}
						>
							{subItem.title}
						</Link>
					))}
					<Separator className="my-2" />
					{solutions.items.map((subItem) => (
						<Link
							key={subItem.title}
							href={subItem.href}
							className="py-2 text-sm"
							onClick={() => setOpen(false)}
							target="_blank"
						>
							{subItem.title}
						</Link>
					))}
					<Separator className="my-2" />
					<Link
						href="/pricing"
						className="py-2 text-sm"
						onClick={() => setOpen(false)}
					>
						Pricing
					</Link>
					<Link
						href="/signin"
						className="py-2 text-sm"
						onClick={() => setOpen(false)}
					>
						Log In
					</Link>
					<div className="mt-4">
						<Button asChild className="w-full">
							<Link href="/register" onClick={() => setOpen(false)}>
								Sign Up
							</Link>
						</Button>
					</div>
				</nav>
			</SheetContent>
		</Sheet>
	);
};
