import { ReactNode } from "react"
import { ChevronRightIcon } from "lucide-react"
import { BreadcrumbChip } from "./breadcrumb-chip"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ReactNode
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={className}>
      <div className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-3 w-3 text-muted-foreground mx-2" />
            )}
            
            {index === items.length - 1 ? (
              // Last item (current page) - no link, just text
              <BreadcrumbChip variant="current">
                {item.label}
              </BreadcrumbChip>
            ) : (
              // Navigation items - with links and icons
              <BreadcrumbChip href={item.href} icon={item.icon}>
                {item.label}
              </BreadcrumbChip>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}
