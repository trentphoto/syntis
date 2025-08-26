import { NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const body = await req.json()
    
    const {
      companyName,
      contactEmail,
      contactPhone,
      address,
      businessType,
      ein,
      domain,
      password
    } = body

    // Validate required fields
    if (!companyName || !contactEmail || !password) {
      return NextResponse.json({ 
        error: "Company name, contact email, and password are required" 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json({ 
        error: "Invalid email format" 
      }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ 
        error: "Password must be at least 8 characters long" 
      }, { status: 400 })
    }

    // Check if email already exists - we'll handle this during signup
    // The auth.signUp will return an error if the email already exists

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: contactEmail,
      password,
      options: {
        data: { 
          company_name: companyName,
          full_name: companyName
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/supplier/dashboard`,
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    const userId = authData.user?.id
    if (!userId) {
      return NextResponse.json({ 
        error: "Failed to create user account" 
      }, { status: 500 })
    }

    // Create supplier profile
    const { error: supplierError } = await supabase
      .from("suppliers")
      .insert({
        company_name: companyName,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        address: address || null,
        business_type: businessType || null,
        ein: ein || null,
        domain: domain || null,
        status: "pending",
      })

    if (supplierError) {
      console.error("Error creating supplier profile:", supplierError)
      // Note: We don't fail here because the user was created successfully
      // The supplier profile can be created manually later if needed
    }

    // Assign supplier role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role: "supplier",
        is_active: true,
        assigned_at: new Date().toISOString(),
      })

    if (roleError) {
      console.error("Error assigning supplier role:", roleError)
      // Note: We don't fail here because the user was created successfully
      // The role can be assigned manually later if needed
    }

    return NextResponse.json({ 
      success: true, 
      user_id: userId,
      supplier_profile_created: !supplierError,
      role_assigned: !roleError,
      message: "Supplier account created successfully"
    })

  } catch (err: unknown) {
    console.error("Supplier creation error:", err)
    return NextResponse.json({ 
      error: (err as Error)?.message ?? "An unexpected error occurred" 
    }, { status: 500 })
  }
}
