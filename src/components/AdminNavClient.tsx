'use client';

import AdminNav from './AdminNav';

interface AdminNavClientProps {
  className?: string;
}

export default function AdminNavClient({ className }: AdminNavClientProps) {
  return <AdminNav className={className} />;
}
