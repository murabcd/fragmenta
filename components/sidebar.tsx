"use client";

import { usePathname } from "next/navigation";

import Logo from "@/components/logo";

import Link from "next/link";

import { SearchToggleCommand } from "@/components/search-toggle-command";

import { UpgradePro } from "@/components/upgrade-card";

import { OrgSwitcher } from "@/components/org-switcher";

import { Home, Workflow, History, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Home",
    href: "/home",
    icon: Home,
  },
  {
    label: "Forms",
    href: "/forms",
    icon: Workflow,
  },
  {
    label: "Recent",
    href: "/recent",
    icon: History,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 flex flex-col h-full border bg-background">
      <div className="ml-3 mt-2">
        <Logo />
      </div>
      <OrgSwitcher />
      <SearchToggleCommand />
      <nav className="mt-5 grid items-start px-2 text-sm text-muted-foreground">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm group flex p-3 w-full justify-start cursor-pointer hover:text-foreground rounded-lg transition",
              {
                "bg-primary/10 text-foreground": pathname.startsWith(route.href),
              }
            )}
          >
            <div className="flex items-center justify-center">
              <route.icon className="mr-2 h-5 w-5" />
              {route.label}
            </div>
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-3">
        <UpgradePro />
      </div>
    </div>
  );
};
