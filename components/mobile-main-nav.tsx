"use client";

import React from "react";

import Link from "next/link";

import Image from "next/image";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const menu = [
  {
    title: "Getting started",
    items: [{ title: "About", href: "/about" }],
  },
  {
    title: "Developers",
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
  },
];

export const MobileMainNav = () => {
  const [open, setOpen] = React.useState(false);

  const handleCloseSheet = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <div className="flex justify-between items-center p-4 border-b">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="logo"
              height={20}
              width={20}
              className="dark:hidden mr-2"
            />
            <Image
              src="/logo-dark.svg"
              alt="logo"
              height={20}
              width={20}
              className="hidden dark:block mr-2"
            />
          </Link>
        </div>
        <nav className="flex flex-col">
          <Accordion type="single" collapsible className="w-full">
            {menu.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={item.title}>
                <AccordionTrigger className="px-4 py-2">{item.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="px-8 py-2 text-base"
                        target="_blank"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Link
            href="/pricing"
            className="px-4 py-2 font-medium"
            onClick={handleCloseSheet}
          >
            Pricing
          </Link>
          <Link href="/signin" className="px-4 py-2 font-medium">
            Log In
          </Link>
          <div className="p-4">
            <Button asChild className="w-full">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
