"use client"

import React from 'react';
import AdminNavClient from "@/components/AdminNavClient";

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavClient />
      
      <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Audit</h1>
        <p className="text-muted-foreground">View system audit logs and activity history.</p>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>
          <p className="text-muted-foreground">
            Audit logs and activity history will be displayed here.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
