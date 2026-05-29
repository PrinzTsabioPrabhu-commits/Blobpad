import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border-4 border-gray-900 bg-blue-500 text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-blue-600 hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]",
        destructive:
          "border-4 border-gray-900 bg-red-500 text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-4 border-gray-900 bg-white text-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-gray-50 hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]",
        secondary:
          "border-4 border-gray-900 bg-yellow-400 text-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-yellow-500 hover:translate-y-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-xl px-4 has-[>svg]:px-3",
        lg: "h-14 rounded-xl px-8 has-[>svg]:px-6 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
