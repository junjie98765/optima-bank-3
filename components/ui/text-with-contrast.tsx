import type React from "react"
import { cn } from "@/lib/utils"

interface TextWithContrastProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function TextWithContrast({ children, className, as: Component = "span" }: TextWithContrastProps) {
  return <Component className={cn("text-white drop-shadow-md", className)}>{children}</Component>
}
