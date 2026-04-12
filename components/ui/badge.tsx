import { cn } from "@/lib/utils";

export function Badge({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/80 bg-white/80 px-3 py-1 text-xs font-semibold text-ink/70",
        className
      )}
    >
      {children}
    </span>
  );
}
