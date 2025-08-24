"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type Props = {
  role?: string | null;
};

export default function RoleBanner({ role }: Props) {
  const router = useRouter();

  const label =
    role === "super_admin"
      ? "Admin Portal"
      : role === "client"
      ? "Client Portal"
      : role === "supplier"
      ? "Supplier Portal"
      : null;

  if (!label) return null;

  async function handleLogout() {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      // sign out
      await supabase.auth.signOut();
    } catch (err) {
      // best-effort: log error client-side
      // eslint-disable-next-line no-console
      console.error("Logout failed", err);
    } finally {
      router.push("/auth/login");
    }
  }

  return (
    <div className="w-full bg-[#0b1220] text-white py-2 px-6 text-sm font-semibold ">
      <div className="flex items-center justify-between">
        <div>SyNtis</div>
        <div className="flex items-center gap-4">
          <div>{label}</div>
          <Button variant="link" size="sm" className="text-white" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
