import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  console.log("🚀 [supplier/create] Starting supplier creation process...");
  
  try {
    const supabase = await createClient();
    
    // Get the request body
    const body = await request.json();
    const { 
      companyName, 
      contactEmail, 
      contactPhone, 
      address, 
      businessType, 
      ein, 
      domain,
      password,
      clientId // Optional: for admin usage
    } = body;

    console.log("📝 [supplier/create] Request data:", {
      companyName,
      contactEmail,
      contactPhone: contactPhone ? "***" : null,
      address: address ? "***" : null,
      businessType,
      ein: ein ? "***" : null,
      domain,
      hasPassword: !!password,
      hasClientId: !!clientId
    });

    // Validate required fields
    if (!companyName || !contactEmail) {
      console.error("❌ [supplier/create] Missing required fields");
      return NextResponse.json(
        { error: "Company name and contact email are required" },
        { status: 400 }
      );
    }

    // Check if supplier with this email already exists
    console.log("🔍 [supplier/create] Checking if supplier already exists...");
    const { data: existingSupplier, error: existingError } = await supabase
      .from("suppliers")
      .select("id")
      .eq("contact_email", contactEmail)
      .single()
    
    if (existingError && existingError.code !== 'PGRST116') {
      console.error("❌ [supplier/create] Error checking existing supplier:", existingError);
      return NextResponse.json(
        { error: "Failed to check existing supplier" },
        { status: 500 }
      );
    }
    
    if (existingSupplier) {
      console.error("❌ [supplier/create] Supplier already exists with email:", contactEmail);
      return NextResponse.json(
        { error: "A supplier with this email already exists" },
        { status: 409 }
      );
    }

    // Determine password to use
    let finalPassword = password;
    let tempPassword = null;
    
    if (!password) {
      // Generate temporary password if none provided (admin usage)
      tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      finalPassword = tempPassword;
    }

    // Create the user account
    console.log("👤 [supplier/create] Creating user account...");
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: contactEmail,
      password: finalPassword,
      email_confirm: !!password, // Auto-confirm if password provided (public signup)
      user_metadata: {
        role: "supplier",
        company_name: companyName,
        full_name: companyName
      }
    });

    if (authError) {
      console.error("❌ [supplier/create] User creation failed:", authError);
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    if (!authData.user) {
      console.error("❌ [supplier/create] No user data returned from auth creation");
      return NextResponse.json(
        { error: "User creation failed - no user data returned" },
        { status: 500 }
      );
    }

    const userId = authData.user.id;
    console.log("✅ [supplier/create] User created successfully with ID:", userId);

    // Create supplier profile linked to the user account
    console.log("🏢 [supplier/create] Creating supplier profile...");
    const { data: supplierData, error: supplierError } = await supabase
      .from("suppliers")
      .insert({
        id: userId, // CRITICAL: Link supplier ID to auth user ID
        company_name: companyName,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        address: address || null,
        business_type: businessType || null,
        ein: ein || null,
        domain: domain || null,
        status: "pending",
        overall_risk_level: "medium",
        client_id: clientId || null
      })
      .select()
      .single();

    if (supplierError) {
      console.error("❌ [supplier/create] Supplier profile creation failed:", supplierError);
      
      // Try to clean up the created user if supplier creation fails
      console.log("🧹 [supplier/create] Cleaning up failed user account...");
      const { error: cleanupError } = await supabase.auth.admin.deleteUser(userId);
      if (cleanupError) {
        console.error("⚠️ [supplier/create] Failed to cleanup user account:", cleanupError);
      }
      
      return NextResponse.json(
        { error: "Failed to create supplier profile" },
        { status: 500 }
      );
    }

    console.log("✅ [supplier/create] Supplier profile created successfully:", {
      supplierId: supplierData.id,
      companyName: supplierData.company_name,
      contactEmail: supplierData.contact_email
    });

    // Assign supplier role to the user
    console.log("🎭 [supplier/create] Assigning supplier role...");
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role: "supplier",
        is_active: true
      });

    if (roleError) {
      console.error("❌ [supplier/create] Role assignment failed:", roleError);
      // Don't fail the entire request for role assignment failure
      // The user can still access the system and role can be assigned manually
      console.log("⚠️ [supplier/create] Continuing despite role assignment failure");
    } else {
      console.log("✅ [supplier/create] Supplier role assigned successfully");
    }

    // If a client is assigned, create the relationship
    if (clientId) {
      console.log("🔗 [supplier/create] Creating supplier-client relationship...");
      const { error: relationshipError } = await supabase
        .from("supplier_client_relationships")
        .insert({
          client_id: clientId,
          supplier_id: userId,
          status: "active",
          relationship_start_date: new Date().toISOString(),
        });

      if (relationshipError) {
        console.error("❌ [supplier/create] Error creating supplier-client relationship:", relationshipError);
        // Don't fail the request, but log the error
      } else {
        console.log("✅ [supplier/create] Supplier-client relationship created successfully");
      }
    }

    // Send invitation email automatically if no password provided (admin usage)
    if (!password && tempPassword) {
      console.log("📧 [supplier/create] Sending invitation email...");
      try {
        const { error: emailError } = await supabase.auth.admin.generateLink({
          type: 'signup',
          email: contactEmail,
          password: tempPassword,
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
            data: {
              company_name: companyName,
              temp_password: tempPassword
            }
          }
        });
        
        if (emailError) {
          console.error("❌ [supplier/create] Error sending invitation email:", emailError);
        } else {
          console.log("✅ [supplier/create] Invitation email sent successfully");
        }
      } catch (emailErr) {
        console.error("❌ [supplier/create] Error with email invitation:", emailErr);
      }
    }

    // Verify the complete setup
    console.log("🔍 [supplier/create] Verifying complete setup...");
    const { data: verificationData, error: verificationError } = await supabase
      .from("suppliers")
      .select("*")
      .eq("id", userId)
      .single();

    if (verificationError || !verificationData) {
      console.error("❌ [supplier/create] Verification failed - supplier record not found:", verificationError);
      return NextResponse.json(
        { error: "Supplier creation verification failed" },
        { status: 500 }
      );
    }

    console.log("✅ [supplier/create] Complete setup verified successfully");

    // Return appropriate response based on request type
    if (!password && tempPassword) {
      // Admin request (no password provided)
      return NextResponse.json({ 
        success: true, 
        supplier_id: supplierData.id,
        user_id: userId,
        temp_password: tempPassword,
        contactEmail: contactEmail,
        message: "Supplier created successfully. User will receive an email to confirm their account."
      });
    } else {
      // Public signup (password provided)
      return NextResponse.json({
        message: "Supplier account created successfully",
        user: {
          id: userId,
          email: contactEmail,
          role: "supplier"
        },
        supplier: {
          id: supplierData.id,
          company_name: supplierData.company_name,
          status: supplierData.status
        }
      });
    }

  } catch (error) {
    console.error("💥 [supplier/create] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
