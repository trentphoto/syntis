"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Props = {
  role?: string | null;
};

export default function RoleBanner({ role }: Props) {
  const [userEmail, setUserEmail] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<string | null>(role || null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial user state
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        setIsAuthenticated(true);
      } else {
        setUserEmail("");
        setIsAuthenticated(false);
      }
    };

    // Get initial session state
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        setIsAuthenticated(true);
      }
    };

    // Get user role if not provided
    const getUserRole = async () => {
      if (!currentRole) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .maybeSingle();
          
          if (roleData?.role) {
            setCurrentRole(roleData.role);
          }
        }
      }
    };

    // Check both user and session
    getUser();
    getSession();
    getUserRole();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        if (event === 'SIGNED_OUT' || !session?.user) {
          setUserEmail("");
          setIsAuthenticated(false);
          setCurrentRole(null);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user?.email) {
            setUserEmail(session.user.email);
            setIsAuthenticated(true);
            // Fetch role after sign in
            if (session.user.id) {
              const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .eq('is_active', true)
                .maybeSingle();
              
              if (roleData?.role) {
                setCurrentRole(roleData.role);
              }
            }
          }
        } else if (session?.user?.email) {
          setUserEmail(session.user.email);
          setIsAuthenticated(true);
        }
      }
    );

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [role, currentRole]);

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      router.push("/auth/login");
    }
  }

  const label =
    currentRole === "super_admin"
      ? "Admin Portal"
      : currentRole === "client"
      ? "Client Portal"
      : currentRole === "supplier"
      ? "Supplier Portal"
      : null;

  // Show banner if we have a role OR if user is authenticated (role might be loading)
  if (!label && !isAuthenticated) return null;

  return (
    <div className="w-full bg-[#0b1220] text-white py-2 px-6 text-sm font-semibold ">
      <div className="flex items-center justify-between">
        <div>SyNtis</div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-white">
            <div>{label || "Portal"}</div>
          </Link>
          
          {/* User Profile Dropdown - Only show when authenticated */}
          {isAuthenticated && userEmail && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 px-2 py-1 h-8 hover:bg-white/10 text-white"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-white">
                    {userEmail}
                  </span>
                  <ChevronDown className="w-3 h-3 text-white/70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-border mb-2">
                  <p className="text-sm font-medium text-foreground">Signed in as</p>
                  <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                </div>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
