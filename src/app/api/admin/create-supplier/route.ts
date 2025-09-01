import { NextResponse } from "next/server"
import { getUserRoleFromSession } from "@/lib/supabase/getUserRole"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    // Initialize Supabase client
    const supabase = await createServerClient()
    const { data: { user }, error: userAuthError } = await supabase.auth.getUser()

    if (userAuthError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check for admin role
    const userRole = await getUserRoleFromSession()
    if (!userRole || userRole.role !== 'super_admin') {
      return NextResponse.json({ error: "Super admin access required" }, { status: 403 })
    }

    const body = await req.json()
    const { 
      companyName, 
      contactEmail, 
      contactPhone, 
      address, 
      businessType, 
      ein, 
      domain,
      clientId
    } = body

    if (!companyName || !contactEmail) {
      return NextResponse.json({ 
        error: "Company name and contact email are required" 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json({ 
        error: "Invalid email format" 
      }, { status: 400 })
    }

    // Check if supplier with this email already exists
    const { data: existingSupplier, error: existingError } = await supabase
      .from("suppliers")
      .select("id")
      .eq("contact_email", contactEmail)
      .single()
    
    if (existingError && existingError.code !== 'PGRST116') {
      return NextResponse.json({ error: existingError.message }, { status: 500 })
    }
    
    if (existingSupplier) {
      return NextResponse.json({ 
        error: "A supplier with this email already exists" 
      }, { status: 409 })
    }

    // Create user account with temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
    
    const { data: authData, error: createUserError } = await supabase.auth.signUp({
      email: contactEmail,
      password: tempPassword,
      options: {
        data: {
          company_name: companyName,
          role: 'supplier'
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`
      }
    })

    if (createUserError) {
      return NextResponse.json({ error: createUserError.message }, { status: 500 })
    }
    
    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user account - no user data" }, { status: 500 })
    }

    // Create supplier profile linked to the user account
    const { data: supplierData, error: supplierError } = await supabase
      .from("suppliers")
      .insert({
        id: authData.user.id, // Link to the user account
        company_name: companyName,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        address: address || null,
        business_type: businessType || null,
        ein: ein || null,
        domain: domain || null,
        client_id: clientId || null,
        status: "pending",
      })
      .select()
      .single()

    if (supplierError) {
      // Note: We can't delete the user account without admin privileges
      // The user will need to confirm their email to activate the account
      return NextResponse.json({ 
        error: supplierError.message,
        note: "User account created but needs email confirmation"
      }, { status: 500 })
    }

    // Assign supplier role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({
        user_id: authData.user.id,
        role: "supplier"
      })

    if (roleError) {
      console.error("Error assigning supplier role:", roleError)
      // Don't fail the request, but log the error
    }

    // If a client is assigned, create the relationship
    if (clientId) {
      const { error: relationshipError } = await supabase
        .from("supplier_client_relationships")
        .insert({
          client_id: clientId,
          supplier_id: authData.user.id,
          status: "active",
          relationship_start_date: new Date().toISOString(),
        })

      if (relationshipError) {
        console.error("Error creating supplier-client relationship:", relationshipError)
        // Don't fail the request, but log the error
      }
    }

    // Send invitation email
    try {
      const { error: emailError } = await supabase.auth.admin.generateLink({
        type: 'signup',
        email: contactEmail,
        password: tempPassword,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
          data: {
            company_name: companyName,
            temp_password: tempPassword,
            admin_name: user.email
          }
        }
      })
      
      if (emailError) {
        console.error("Error sending invitation email:", emailError)
      }
    } catch (emailErr) {
      console.error("Error with email invitation:", emailErr)
    }

    return NextResponse.json({ 
      success: true, 
      supplier_id: supplierData.id,
      user_id: authData.user.id,
      temp_password: tempPassword, // Include for admin reference
      contactEmail: contactEmail,
      message: "Supplier created successfully. User will receive an email to confirm their account."
    })

  } catch (err: unknown) {
    console.error("Supplier creation error:", err)
    return NextResponse.json({ 
      error: (err as Error)?.message ?? "An unexpected error occurred" 
    }, { status: 500 })
  }
}
