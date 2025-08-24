import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ColumnConfig {
  key: string
  label: string
  skeletonWidth?: string
  minWidth?: string
}

interface TableSkeletonProps {
  rows?: number
  columns: ColumnConfig[]
  showActions?: boolean
}

export function TableSkeleton({ rows = 5, columns, showActions = true }: TableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead 
              key={column.key} 
              className="text-muted-foreground"
              style={column.minWidth ? { minWidth: column.minWidth } : undefined}
            >
              {column.label}
            </TableHead>
          ))}
          {showActions && (
            <TableHead className="text-muted-foreground">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                <Skeleton className={`h-4 ${column.skeletonWidth || 'w-32'}`} />
              </TableCell>
            ))}
            {showActions && (
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
