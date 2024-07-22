import Link from "next/link";

import Logo from "@/components/logo";

import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <div className="flex items-center justify-between w-full px-8 py-6">
      <Logo />
      <div className="space-x-4">
        <Button variant="ghost" asChild>
          <Link href="/signin">Sign in</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Sign up</Link>
        </Button>
      </div>
    </div>
  );
};
