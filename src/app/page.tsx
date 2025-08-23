import MainNav from "@/components/MainNav";
import { hasEnvVars } from "@/lib/utils";
import Footer from "@/components/footer";
import { getUserRoleFromSession } from "@/lib/supabase/getUserRole";
import AdminDashboard from "@/components/AdminDashboard";
import ClientDashboard from "@/components/ClientDashboard";
import SupplierDashboard from "@/components/SupplierDashboard";

export default async function Home() {
  const roleRow = await getUserRoleFromSession();
  const role = roleRow?.role ?? null;

  const renderDashboard = () => {
    if (!role) return null;
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
        <div className="flex-1 flex flex-col gap-20">
            {role ? (
              renderDashboard()
            ) : (
              <>
                <h2 className="font-medium text-xl mb-4">Next steps</h2>
                {hasEnvVars ? <p>Logged in</p> : <p>Not logged in.</p>}
              </>
            )}
        </div>
    </main>
  );
}
