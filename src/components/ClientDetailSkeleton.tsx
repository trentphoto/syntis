import { Skeleton } from "@/components/ui/skeleton"

export function ClientDetailSkeleton() {
  return (
    <div className="container mx-auto p-6">
      {/* Client header skeleton */}
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-48 mb-4" />

      {/* Suppliers section header */}
      <Skeleton className="h-6 w-24 mb-2" />

      {/* Supplier list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="p-3 border rounded-md bg-white/50">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Back button skeleton */}
      <div className="mt-6">
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  )
}
