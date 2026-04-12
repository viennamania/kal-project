import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-3xl border border-white/70 bg-white/80 px-4 text-base text-ink outline-none transition placeholder:text-slate-400 focus:border-sky focus:bg-white focus:ring-4 focus:ring-sky/20 sm:text-sm",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
