"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AnimatedGradientTextProps {
  children: ReactNode
  className?: string
}

export default function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600 bg-[length:200%_auto] animate-gradient",
        className,
      )}
    >
      {children}
    </span>
  )
}
