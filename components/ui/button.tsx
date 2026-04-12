import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const buttonVariants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  ghost:
    "border border-white/70 bg-white/60 text-ink shadow-soft hover:bg-white",
  primary:
    "bg-ink text-white shadow-bubble hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(30,36,81,0.16)]",
  secondary:
    "bg-candy text-white shadow-[0_16px_32px_rgba(255,111,168,0.28)] hover:-translate-y-0.5"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
          buttonVariants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
