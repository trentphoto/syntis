"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DebugPage() {
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/status");
        const data = await response.json();
        setAuthStatus(data);
      } catch (error) {
        setAuthStatus({ error: "Failed to fetch auth status" });
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const handleAssignRole = async (role: string) => {
    if (!authStatus?.claims?.sub) {
      alert("No user ID found");
      return;
    }

    try {
      const response = await fetch("/api/admin/assign-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: authStatus.claims.sub,
          role: role,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Role ${role} assigned successfully!`);
        // Refresh the page to see the updated status
        window.location.reload();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to assign role");
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(authStatus, null, 2)}
          </pre>
        </div>

        {authStatus?.authenticated && !authStatus?.role && (
          <div className="bg-yellow-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">No Role Assigned</h2>
            <p className="mb-4">Your account doesn't have a role assigned. Assign a role to continue:</p>
            <div className="space-x-2">
              <button
                onClick={() => handleAssignRole("super_admin")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Assign Super Admin
              </button>
              <button
                onClick={() => handleAssignRole("client")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Assign Client
              </button>
              <button
                onClick={() => handleAssignRole("supplier")}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Assign Supplier
              </button>
            </div>
          </div>
        )}

        {authStatus?.role && (
          <div className="bg-green-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Role Assigned</h2>
            <p>Your role: <strong>{authStatus.role}</strong></p>
            <a
              href="/"
              className="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Dashboard
            </a>
          </div>
        )}

        {!authStatus?.authenticated && (
          <div className="bg-red-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Not Authenticated</h2>
            <p>Please log in first.</p>
            <a
              href="/auth/login"
              className="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
