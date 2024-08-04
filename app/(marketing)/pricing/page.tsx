import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Check } from "lucide-react";

export const metadata = {
  title: "Pricing",
  description: "Pricing for Fragmenta",
};

const features = [
  "Unlimited forms",
  "Unlimited seats",
  "Unlimited AI credits",
  "Advanced analytics",
  "Google Sheets integration",
  "Discord community",
];

const PricingPage = () => {
  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex flex-col relative">
          <h1 className="text-6xl font-bold mb-4">
            Simple,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-500 via-green-600 to-emerald-500">
              transparent
            </span>{" "}
            pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Fragmenta will remain free while in beta.
          </p>
        </div>
        <div className="grid w-full items-start gap-10 p-10 md:grid-cols-[1fr_200px]">
          <div className="grid gap-6">
            <h3 className="text-2xl font-bold text-left">What&apos;s included</h3>
            <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 text-left">
              {features.map((feature) => (
                <li className="flex items-center" key={feature}>
                  <Check className="mr-2 h-4 w-4" /> {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 text-center">
            <div>
              <h4 className="text-7xl font-bold">$0</h4>
              <p className="text-sm font-medium text-muted-foreground">monthly</p>
            </div>
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
