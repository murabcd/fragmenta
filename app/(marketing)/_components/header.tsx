import Link from "next/link";

import Logo from "@/components/logo";

import { Button } from "@/components/ui/button";

import { MainNav } from "@/components/main-nav";

import { MobileMainNav } from "@/components/mobile-main-nav";

export const Header = () => {
  return (
    <div className="flex items-center justify-between w-full px-8 py-6 relative z-50">
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
  );
};
