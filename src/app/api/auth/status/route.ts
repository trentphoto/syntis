import { createClient } from "@/lib/supabase/server";
import { getUserRoleFromSession } from "@/lib/supabase/getUserRole";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.getClaims();
    
    if (error || !data?.claims) {
      return NextResponse.json({
        authenticated: false,
        error: error?.message || "No claims found"
      });
    }

    const roleRow = await getUserRoleFromSession();
    
    return NextResponse.json({
      authenticated: true,
      claims: data.claims,
      role: roleRow?.role || null,
      roleData: roleRow
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
