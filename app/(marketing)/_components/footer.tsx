import Link from "next/link";
import { Icons } from "@/components/icons";

export const Footer = () => {
  return (
    <footer className="flex items-center justify-between w-full px-8 py-6">
      <div className="text-sm text-muted-foreground">
        © 2024 Fragmenta, Inc. All rights reserved.
      </div>
      <div className="flex space-x-4">
        <Link
          href="https://linkedin.com/company/fragmentainc/"
          className="text-muted-foreground hover:text-foreground transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icons.linkedin className="h-5 w-5" />
        </Link>
        <Link
          href="https://x.com/fragmentainc"
          className="text-muted-foreground hover:text-foreground transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icons.twitter className="h-5 w-5" />
        </Link>
      </div>
    </footer>
  );
};
