"use client";

import Link from "next/link";

import Logo from "@/components/logo";

import { Button } from "@/components/ui/button";

import { MainNav } from "@/components/main-nav";

import { MobileMainNav } from "@/components/mobile-main-nav";

import { useScroll } from "@/hooks/use-scroll";

import { cn } from "@/lib/utils";

export const Header = () => {
  const scrolled = useScroll();

  return (
    <header
      className={cn(
        "sticky top-0 z-20 w-full bg-transparent transition-all duration-300",
        scrolled && "bg-background/70 backdrop-blur-md shadow-sm"
      )}
    >
      <div className="flex items-center justify-between w-full px-8 py-6">
        <Logo />
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <MainNav />
        </div>
        <div className="hidden md:flex space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
        <MobileMainNav />
      </div>
    </header>
  );
};
