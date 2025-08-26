"use client"

import React from 'react';
import AdminNavClient from "@/components/AdminNavClient";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavClient />
      
      <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">View and analyze system data and metrics.</p>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Analytics content will be displayed here.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
