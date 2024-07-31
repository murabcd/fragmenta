import Link from "next/link";

import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex flex-col relative">
          <h1 className="text-6xl font-bold mb-4 relative">
            Create{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500">
              powerful forms
            </span>{" "}
            with AI-driven insights
          </h1>
          <p className="text-xl text-muted-foreground">
            Fragmenta is an open-source Typeform alternative.
          </p>
        </div>
        <div className="flex justify-center items-center mt-10">
          <Link href="/register" target="_blank" rel="noopener noreferrer">
            <Button>Create your form</Button>
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
