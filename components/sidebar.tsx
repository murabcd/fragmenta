"use client";

import SidebarLogo from "@/components/sidebar-logo";
import SearchToggleCommand from "@/components/search-toggle-command";
import OrgSwitcher from "@/components/org-switcher";

import { Home, Workflow, History, Settings } from "lucide-react";

import UpgradePro from "@/components/upgrade-card";

const routes = [
  {
    label: "Home",
    href: "/home",
    icon: Home,
    pro: false,
  },
  {
    label: "Forms",
    href: "/forms",
    icon: Workflow,
    pro: false,
  },
  {
    label: "Recent",
    href: "/recent",
    icon: History,
    pro: false,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    pro: true,
  },
];

const Sidebar = () => {
  return (
    <div className="w-64 flex flex-col h-full bg-secondary">
      <SidebarLogo />
      <OrgSwitcher />
      <SearchToggleCommand />
      <nav className="mt-5 grid items-start px-2 text-sm font-medium text-muted-foreground">
        {routes.map((route) => (
          <div
            key={route.href}
            className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition"
          >
            <div className="flex items-center justify-center">
              <route.icon className="mr-2 h-5 w-5" />
              {route.label}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-auto p-3">
        <UpgradePro />
      </div>
    </div>
  );
};

export default Sidebar;
