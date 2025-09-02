import { AdminClientDetailSkeleton } from "@/components/AdminClientDetailSkeleton"
import AdminNavClient from "@/components/AdminNavClient"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavClient />
      <AdminClientDetailSkeleton />
    </div>
  )
}
