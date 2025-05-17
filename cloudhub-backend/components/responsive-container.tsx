import type { ReactNode } from "react"

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export default function ResponsiveContainer({
  children,
  className = "",
  as: Component = "div",
}: ResponsiveContainerProps) {
  return <Component className={`container mx-auto px-4 sm:px-6 md:px-8 ${className}`}>{children}</Component>
}
