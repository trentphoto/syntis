"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Props = {
  role?: string | null;
  userEmail?: string | null;
  isAuthenticated?: boolean;
};

export default function RoleBanner({ role, userEmail: propUserEmail, isAuthenticated: propIsAuthenticated }: Props) {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  
  // Use props or fallback to empty values
  const userEmail = propUserEmail || "";
  const isAuthenticated = propIsAuthenticated || false;
  const currentRole = role || null;

  async function handleLogout() {
    console.log('=== LOGOUT DEBUG START ===');
    console.log('Logout button clicked');
    console.log('Current state - userEmail:', userEmail, 'isAuthenticated:', isAuthenticated, 'currentRole:', currentRole);
    
    // Set loading state
    setIsLoggingOut(true);
    
    // Keep dropdown open during logout
    setIsDropdownOpen(true);
    
    try {
      console.log('Creating Supabase client...');
      const supabase = createClient();
      console.log('Supabase client created:', supabase);
      console.log('Auth object:', supabase.auth);
      
      if (!supabase.auth || typeof supabase.auth.signOut !== 'function') {
        console.error('Supabase auth object is not properly initialized');
        return;
      }
      
      console.log('Signing out...');
      try {
        const signOutPromise = supabase.auth.signOut();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('signOut timeout after 10s')), 10000)
        );
        
        const result = await Promise.race([signOutPromise, timeoutPromise]) as any;
        const error = result?.error;
        
        if (error) {
          console.error('Supabase signOut error:', error);
          console.error('Error details:', {
            message: error.message,
            status: error.status,
            name: error.name,
            stack: error.stack
          });
        } else {
          console.log('Sign out successful');
        }
      } catch (signOutErr) {
        console.error('signOut failed or timed out:', signOutErr);
        
        // Fallback: Force clear local state and redirect
        console.log('Using fallback logout approach...');
        try {
          // Clear local storage
          localStorage.removeItem('supabase.auth.token');
          sessionStorage.removeItem('supabase.auth.token');
          
          // Clear any cookies
          document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
          });
          
          console.log('Local state cleared, forcing redirect...');
        } catch (fallbackErr) {
          console.error('Fallback logout failed:', fallbackErr);
        }
      }
    } catch (err) {
      console.error("Logout failed", err);
      console.error("Error details:", err);
    } finally {
      console.log('Redirecting to login page...');
      try {
        await router.push("/auth/login");
        console.log('Router.push completed');
      } catch (routerError) {
        console.error('Router.push error:', routerError);
      }
      console.log('=== LOGOUT DEBUG END ===');
      
      // Reset loading state
      setIsLoggingOut(false);
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

  // Always show the banner, but with different content based on auth state

  return (
    <div className="w-full bg-[#0b1220] text-white py-2 px-6 text-sm font-semibold ">
      <div className="flex items-center justify-between">
        <div>SyNtis</div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-white">
            <div>{label || "Portal"}</div>
          </Link>
          
          {/* Show different content based on auth state */}
          {isAuthenticated && userEmail ? (
            // User Profile Dropdown - when authenticated
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Not logged in message
            <div className="text-white/70 text-xs">
              Not logged in
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
