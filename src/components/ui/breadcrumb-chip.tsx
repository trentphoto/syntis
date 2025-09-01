import { ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BreadcrumbChipProps {
  href?: string
  icon?: ReactNode
  children: ReactNode
  variant?: "default" | "current"
  className?: string
}

export function BreadcrumbChip({ 
  href, 
  icon, 
  children, 
  variant = "default",
  className 
}: BreadcrumbChipProps) {
  const baseClasses = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors"
  
  const variantClasses = {
    default: "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
    current: "text-foreground font-medium text-sm"
  }

  const classes = cn(baseClasses, variantClasses[variant], className)

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon}
        {children}
      </Link>
    )
  }

  return (
    <span className={classes}>
      {icon}
      {children}
    </span>
  )
}
