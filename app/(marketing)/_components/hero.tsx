import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/grid-pattern";

export const Hero = () => {
  return (
    <div className="w-full">
      <GridPattern />
      <div className="max-w-2xl mx-auto text-center pt-50">
        <div className="flex flex-col relative">
          <h1 className="text-7xl font-semibold mb-4 relative">Fragmenta</h1>
          <p className="text-muted-foreground text-xl">A new way to manage your forms.</p>
        </div>
        <div className="flex justify-center items-center mt-10">
          <Link
            href="/published/j5728zde5ya7kr1fwqjnkrxyfs6w3j91"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>Join waitlist</Button>
          </Link>
          <div className="ml-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
