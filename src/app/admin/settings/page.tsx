"use client"

import React from 'react';
import AdminNavClient from "@/components/AdminNavClient";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavClient />
      
      <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage system configuration and preferences.</p>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <p className="text-muted-foreground">
            System configuration options will be displayed here.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
