import { NextResponse } from "next/server"
import { getUserRoleFromSession } from "@/lib/supabase/getUserRole"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    // Initialize Supabase client (with anon/public key)
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check for super_admin role (your custom logic)
    const userRole = await getUserRoleFromSession()
    if (!userRole || userRole.role !== 'super_admin') {
      return NextResponse.json({ error: "Super admin access required" }, { status: 403 })
    }

    const body = await req.json()
    const { name, contact_email, password } = body

    if (!name || !contact_email || !password) {
      return NextResponse.json({ error: "name, contact_email, and password required" }, { status: 400 })
    }

    // Create user with signUp
    const { data, error } = await supabase.auth.signUp({
      email: contact_email,
      password,
      options: {
        data: { name }, // Add name to user_metadata
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/welcome`, // Optional: redirect after confirmation
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const userId = data.user?.id ?? null

    if (!userId) {
      return NextResponse.json({ error: "Failed to create user account" }, { status: 500 })
    }

    // Assign 'client' role to the new user
    const roleInsertRes = await supabase.from("user_roles").insert({
      user_id: userId,
      role: 'client',
      is_active: true,
      assigned_at: new Date().toISOString(),
      assigned_by: user.id, // The super_admin who created this client
    })

    if (roleInsertRes.error) {
      console.error("Error assigning client role:", roleInsertRes.error)
      // Note: We don't fail here because the user was created successfully
      // The role can be assigned manually later if needed
    }

    // Insert client row with user_id
    const insertRes = await supabase.from("clients").insert({
      name,
      contact_email,
      user_id: userId,
    })

    if (insertRes.error) {
      return NextResponse.json({ error: insertRes.error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      user_id: userId,
      role_assigned: !roleInsertRes.error,
      message: "Client created successfully with user account and role assignment"
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
