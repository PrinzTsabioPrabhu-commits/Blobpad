import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-gray-900 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-11 w-full min-w-0 rounded-xl border-4 bg-white px-4 py-2 text-base font-medium text-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:translate-y-1 focus-visible:shadow-[0px_0px_0px_rgba(0,0,0,1)] focus-visible:border-blue-500",
        "aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
