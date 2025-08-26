import { getUserRoleFromSession } from "@/lib/supabase/getUserRole";
import AdminDashboard from "@/components/AdminDashboard";
import ClientDashboard from "@/components/ClientDashboard";
import { createClient } from "@/lib/supabase/server";
import SupplierDashboard from "@/components/SupplierDashboard";
import RoleBanner from "@/components/RoleBanner";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    // If no user claims, redirect to login
    redirect("/auth/login");
  }

  const roleRow = await getUserRoleFromSession();
  const role = roleRow?.role ?? null;

  const renderDashboard = () => {
    if (!role) {
      return (
        <div className="text-center">
          <h2 className="font-medium text-xl mb-4">No Role Assigned</h2>
          <p>Your account doesn't have a role assigned yet. Please contact an administrator.</p>
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
      <div className="flex-1 flex flex-col gap-20 p-8">
        <RoleBanner role={role} />
        {renderDashboard()}
      </div>
    </main>
  );
}
