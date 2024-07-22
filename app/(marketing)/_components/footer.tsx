import Link from "next/link";

import { ModeToggle } from "@/components/theme-toggle-mode";

export const Footer = () => {
  return (
    <footer className="flex items-center justify-between w-full px-8 py-6">
      <div className="flex space-x-4">
        <Link
          href="https://linkedin.com/company/fragmentainc/"
          className="text-muted-foreground hover:text-foreground transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </Link>
        <Link
          href="https://x.com/fragmentainc"
          className="text-muted-foreground hover:text-foreground transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </Link>
      </div>
      <ModeToggle />
    </footer>
  );
};
