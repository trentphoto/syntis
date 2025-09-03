import { getUserRoleFromSession } from "@/lib/supabase/getUserRole";
import AdminDashboard from "@/components/AdminDashboard";
import ClientDashboard from "@/components/ClientDashboard";
import { createClient } from "@/lib/supabase/server";
import SupplierDashboard from "@/components/SupplierDashboard";
import { redirect } from "next/navigation";
import TopToolbar from "@/components/TopToolbar";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    // If no user claims, redirect to login
    redirect("/auth/login");
  }

  // Extract user email from claims
  const userEmail = data.claims.email || null;
  const isAuthenticated = !!data.claims;

  const roleRow = await getUserRoleFromSession();
  const role = roleRow?.role ?? null;

  const renderDashboard = () => {
    if (!role) {
      return (
        <div className="text-center">
          <h2 className="font-medium text-xl mb-4">No Role Assigned</h2>
          <p>Your account doesn&apos;t have a role assigned yet. Please contact an administrator.</p>
        </div>
      );
    }
    
    const r = role.toLowerCase();
    if (r === "super_admin") {
      return <AdminDashboard />;
    }
    if (r === "client") {
      return <ClientDashboard />;
    }
    if (r === "supplier") {
      return <SupplierDashboard />;
    }
    return <p>Unknown role: {role}</p>;
  };

  return (
    <main className="min-h-screen flex flex-col items-center">

      {/* Top Toolbar */}
      <TopToolbar 
        role={role} 
        userEmail={userEmail}
        isAuthenticated={isAuthenticated}
      />

      {/* Dashboard */}
      <div className="flex-1 flex flex-col gap-20 p-8 w-full container mx-auto">
        {renderDashboard()}
      </div>
      
    </main>
  );
}
