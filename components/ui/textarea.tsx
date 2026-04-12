import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-[28px] border border-white/70 bg-white/80 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-sky focus:bg-white focus:ring-4 focus:ring-sky/20",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
