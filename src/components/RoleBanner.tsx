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
      console.log('=== GETTING INITIAL USER ===');
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('Initial user data:', user);
      if (error) console.log('Get user error:', error);
      if (user?.email) {
        console.log('Setting initial user email:', user.email);
        setUserEmail(user.email);
        setIsAuthenticated(true);
      } else {
        console.log('No user found, clearing state');
        setUserEmail("");
        setIsAuthenticated(false);
      }
      console.log('=== END GETTING INITIAL USER ===');
    };

    // Get initial session state
    const getSession = async () => {
      console.log('=== GETTING INITIAL SESSION ===');
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Initial session data:', session);
      if (error) console.log('Get session error:', error);
      if (session?.user?.email) {
        console.log('Setting initial session user email:', session.user.email);
        setUserEmail(session.user.email);
        setIsAuthenticated(true);
      }
      console.log('=== END GETTING INITIAL SESSION ===');
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
        console.log('=== AUTH STATE CHANGE ===');
        console.log('Event:', event);
        console.log('Session user:', session?.user);
        console.log('Session user email:', session?.user?.email);
        console.log('Previous state - userEmail:', userEmail, 'isAuthenticated:', isAuthenticated, 'currentRole:', currentRole);
        
        if (event === 'SIGNED_OUT' || !session?.user) {
          console.log('Processing SIGNED_OUT event - clearing state');
          setUserEmail("");
          setIsAuthenticated(false);
          setCurrentRole(null);
          console.log('State cleared - userEmail: "", isAuthenticated: false, currentRole: null');
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('Processing SIGNED_IN/TOKEN_REFRESHED event');
          if (session?.user?.email) {
            setUserEmail(session.user.email);
            setIsAuthenticated(true);
            console.log('Updated state - userEmail:', session.user.email, 'isAuthenticated: true');
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
                console.log('Updated role:', roleData.role);
              }
            }
          }
        } else if (session?.user?.email) {
          console.log('Processing other event with user - updating state');
          setUserEmail(session.user.email);
          setIsAuthenticated(true);
          console.log('Updated state - userEmail:', session.user.email, 'isAuthenticated: true');
        }
        console.log('=== END AUTH STATE CHANGE ===');
      }
    );

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [role, currentRole]);

  async function handleLogout() {
    console.log('=== LOGOUT DEBUG START ===');
    console.log('Logout button clicked');
    console.log('Current state - userEmail:', userEmail, 'isAuthenticated:', isAuthenticated, 'currentRole:', currentRole);
    
    // Check environment variables
    console.log('Environment variables check:');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
    console.log('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY ? 'SET (length: ' + process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY.length + ')' : 'NOT SET');
    
    // Check network status
    console.log('Network status check:');
    console.log('navigator.onLine:', navigator.onLine);
    console.log('navigator.connection:', (navigator as any).connection);
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      console.log('Connection effectiveType:', connection?.effectiveType);
      console.log('Connection downlink:', connection?.downlink);
      console.log('Connection rtt:', connection?.rtt);
    }
    
    try {
      console.log('Creating Supabase client...');
      const supabase = createClient();
      console.log('Supabase client created:', supabase);
      console.log('Auth object:', supabase.auth);
      console.log('Auth methods available:', Object.getOwnPropertyNames(supabase.auth));
      console.log('signOut method type:', typeof supabase.auth.signOut);
      
      if (!supabase.auth || typeof supabase.auth.signOut !== 'function') {
        console.error('Supabase auth object is not properly initialized');
        return;
      }
      
      // Check current user before logout
      console.log('Checking current user before logout...');
      try {
        const getUserPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('getUser timeout after 5s')), 5000)
        );
        
        const result = await Promise.race([getUserPromise, timeoutPromise]) as any;
        const currentUser = result?.data?.user;
        const getUserError = result?.error;
        console.log('Current user before logout:', currentUser);
        if (getUserError) console.log('Get user error:', getUserError);
      } catch (getUserErr) {
        console.error('getUser failed or timed out:', getUserErr);
      }
      
      // Check current session before logout
      console.log('Checking current session before logout...');
      try {
        const getSessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('getSession timeout after 5s')), 5000)
        );
        
        const result = await Promise.race([getSessionPromise, timeoutPromise]) as any;
        const currentSession = result?.data?.session;
        const getSessionError = result?.error;
        console.log('Current session before logout:', currentSession);
        if (getSessionError) console.log('Get session error:', getSessionError);
      } catch (getSessionErr) {
        console.error('getSession failed or timed out:', getSessionErr);
      }
      
      // Test basic connectivity
      console.log('Testing basic connectivity...');
      try {
        const testPromise = fetch('https://ygzybeunfemzcattblyg.supabase.co/rest/v1/', {
          method: 'HEAD',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY}`
          }
        });
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('connectivity test timeout after 5s')), 5000)
        );
        
        const response = await Promise.race([testPromise, timeoutPromise]) as Response;
        console.log('Connectivity test response status:', response.status);
        console.log('Connectivity test response headers:', Object.fromEntries(response.headers.entries()));
      } catch (connectivityErr) {
        console.error('Connectivity test failed:', connectivityErr);
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
          
          // Verify user is logged out
          console.log('Verifying logout...');
          try {
            const { data: { user: userAfterLogout }, error: getUserAfterError } = await supabase.auth.getUser();
            console.log('User after logout:', userAfterLogout);
            if (getUserAfterError) console.log('Get user after logout error:', getUserAfterError);
            
            const { data: { session: sessionAfterLogout }, error: getSessionAfterError } = await supabase.auth.getSession();
            console.log('Session after logout:', sessionAfterLogout);
            if (getSessionAfterError) console.log('Get session after logout error:', getSessionAfterError);
          } catch (verifyErr) {
            console.error('Verification after logout failed:', verifyErr);
          }
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
      console.error("Error type:", typeof err);
      console.error("Error constructor:", err?.constructor?.name);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
      }
    } finally {
      console.log('Redirecting to login page...');
      console.log('Router object:', router);
      console.log('Router methods:', Object.getOwnPropertyNames(router));
      try {
        await router.push("/auth/login");
        console.log('Router.push completed');
      } catch (routerError) {
        console.error('Router.push error:', routerError);
      }
      console.log('=== LOGOUT DEBUG END ===');
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
