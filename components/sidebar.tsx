import SidebarOrg from "./sidebar-org";

import { Home, Workflow, History, Settings } from "lucide-react";

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
    <div className="w-64 flex flex-col h-full text-primary">
      <div className="p-3 justify-center">
        <div className="space-y-2">
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
        </div>
      </div>
      <div className="mt-8">
        <SidebarOrg />
      </div>
    </div>
  );
};

export default Sidebar;
