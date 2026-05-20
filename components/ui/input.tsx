import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-white/40 bg-white/40 px-4 py-3 text-[15px] text-black font-semibold transition-all outline-none backdrop-blur-xl file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-black placeholder:text-black/50 focus-visible:border-[#1d9e75]/70 focus-visible:ring-3 focus-visible:ring-[#1d9e75]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
