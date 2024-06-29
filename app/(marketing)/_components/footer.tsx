import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="py-6 px-4">
      <div className="container mx-auto flex justify-center space-x-4">
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
    </footer>
  );
};
