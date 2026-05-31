import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-xl border border-white/40 bg-white/40 px-4 py-3 text-[15px] text-black font-semibold transition-all outline-none backdrop-blur-xl placeholder:text-black/50 focus-visible:border-[#1d9e75]/70 focus-visible:ring-3 focus-visible:ring-[#1d9e75]/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{ color: "black", ...props.style }}
      {...props}
    />
  )
}

export { Textarea }
