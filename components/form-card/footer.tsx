import { cn } from "@/lib/utils";

interface FormCardFooterProps {
  title: string;
  authorLabel: string;
  createdAtLabel: string;
  onClick: () => void;
}

export const FormCardFooter = ({
  title,
  authorLabel,
  createdAtLabel,
  onClick,
}: FormCardFooterProps) => {
  return (
    <div className="relative p-3">
      <p className="text-sm font-medium text-muted-foreground group-hover:text-primary truncate max-w-[calc(100%-20px)]">
        {title}
      </p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground truncate">
        {authorLabel}, {createdAtLabel}
      </p>
    </div>
  );
};
