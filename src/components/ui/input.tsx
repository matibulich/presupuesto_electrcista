import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-xl border border-white/30 bg-white/50 backdrop-blur-sm px-3 py-1 text-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-slate-400 focus-visible:border-indigo-300/60 focus-visible:ring-[3px] focus-visible:ring-indigo-200/30 focus-visible:bg-white/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-300 aria-invalid:ring-[3px] aria-invalid:ring-red-200/40 md:text-sm dark:aria-invalid:border-red-800/60 dark:aria-invalid:ring-red-900/30 dark:aria-invalid:ring-red-900/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] hover:border-white/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
