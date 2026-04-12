import * as React from "react";

import { cn } from "@/lib/utils";

export function Panel({
  children,
  className
}: React.PropsWithChildren<{
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-bubble backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}
