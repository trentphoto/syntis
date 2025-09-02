import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Supplier } from "./useSupplierManager"

export function useCurrentSupplier() {
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const fetchCurrentSupplier = async () => {
    console.log("🔄 [useCurrentSupplier] Starting to fetch supplier data...")
    setLoading(true)
    setError(null)
    
    try {
      // Get the current authenticated user
      console.log("👤 [useCurrentSupplier] Getting authenticated user...")
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error("❌ [useCurrentSupplier] User auth error:", userError)
        setError("Not authenticated")
        setLoading(false)
        return
      }

      if (!user) {
        console.error("❌ [useCurrentSupplier] No user found")
        setError("Not authenticated")
        setLoading(false)
        return
      }

      console.log("✅ [useCurrentSupplier] User authenticated:", {
        userId: user.id,
        userEmail: user.email,
        userRole: user.user_metadata?.role
      })

      // Find the supplier record for this user by user ID
      console.log("🔍 [useCurrentSupplier] Searching for supplier with ID:", user.id)
      const { data: supplierData, error: supplierError } = await supabase
        .from("suppliers")
        .select(`
          *,
          supplier_client_relationships(
            client_id,
            status,
            relationship_start_date
          )
        `)
        .eq("id", user.id) // Match by user ID since supplier ID is now linked to auth user ID
        .single()

      if (supplierError) {
        console.error("❌ [useCurrentSupplier] Supplier fetch error:", supplierError)
        console.error("❌ [useCurrentSupplier] Error details:", {
          code: supplierError.code,
          message: supplierError.message,
          details: supplierError.details,
          hint: supplierError.hint
        })
        // Don't set error here, just log it and continue
        setLoading(false)
        return
      }

      if (!supplierData) {
        console.error("❌ [useCurrentSupplier] No supplier data found for user ID:", user.id)
        setError("No supplier found for this user")
        setLoading(false)
        return
      }

      console.log("✅ [useCurrentSupplier] Supplier data found:", {
        supplierId: supplierData.id,
        companyName: supplierData.company_name,
        contactEmail: supplierData.contact_email,
        status: supplierData.status,
        hasRelationships: !!supplierData.supplier_client_relationships,
        relationshipCount: supplierData.supplier_client_relationships?.length || 0
      })

      // Get the active relationship and fetch client data
      const activeRelationship = supplierData.supplier_client_relationships?.find(
        (rel: { status: string; client_id: string; relationship_start_date: string | null }) => rel.status === 'active'
      )

      if (activeRelationship?.client_id) {
        console.log("🔗 [useCurrentSupplier] Found active client relationship:", {
          clientId: activeRelationship.client_id,
          status: activeRelationship.status,
          startDate: activeRelationship.relationship_start_date
        })

        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("id, name")
          .eq("id", activeRelationship.client_id)
          .single()

        if (clientError) {
          console.error("❌ [useCurrentSupplier] Client fetch error:", clientError)
        } else if (clientData) {
          console.log("✅ [useCurrentSupplier] Client data loaded:", {
            clientId: clientData.id,
            clientName: clientData.name
          })
          supplierData.client = clientData
          supplierData.relationship_status = activeRelationship.status
          supplierData.relationship_start_date = activeRelationship.relationship_start_date
        }
      } else {
        console.log("ℹ️ [useCurrentSupplier] No active client relationships found")
      }

      console.log("🎯 [useCurrentSupplier] Final supplier data:", {
        id: supplierData.id,
        companyName: supplierData.company_name,
        contactEmail: supplierData.contact_email,
        status: supplierData.status,
        overallRiskLevel: supplierData.overall_risk_level,
        hasClient: !!supplierData.client,
        clientName: supplierData.client?.name
      })

      setSupplier(supplierData as Supplier)
      console.log("✅ [useCurrentSupplier] Supplier state updated successfully")
    } catch (err) {
      console.error("💥 [useCurrentSupplier] Unexpected error:", err)
      console.error("💥 [useCurrentSupplier] Error stack:", (err as Error).stack)
      setError("Failed to load supplier details")
    } finally {
      setLoading(false)
      console.log("🏁 [useCurrentSupplier] Fetch operation completed")
    }
  }

  const updateSupplier = async (updateData: Partial<Supplier>) => {
    if (!supplier) {
      console.error("❌ [useCurrentSupplier] Cannot update: no supplier data")
      return false
    }
    
    console.log("🔄 [useCurrentSupplier] Updating supplier:", {
      supplierId: supplier.id,
      updateData
    })
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from("suppliers")
        .update(updateData)
        .eq("id", supplier.id)
      
      if (error) {
        console.error("❌ [useCurrentSupplier] Update error:", error)
        toast.error("Failed to update supplier information. Please try again.")
        return false
      } else {
        console.log("✅ [useCurrentSupplier] Supplier updated successfully")
        await fetchCurrentSupplier() // Refresh the data
        toast.success("Supplier information updated successfully!")
        return true
      }
    } catch (err) {
      console.error("💥 [useCurrentSupplier] Update unexpected error:", err)
      toast.error("Unable to save changes. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("🚀 [useCurrentSupplier] Hook initialized, fetching supplier data...")
    fetchCurrentSupplier()
  }, [])

  // Debug logging for state changes
  useEffect(() => {
    console.log("📊 [useCurrentSupplier] State updated:", {
      hasSupplier: !!supplier,
      supplierId: supplier?.id,
      loading,
      error
    })
  }, [supplier, loading, error])

  return {
    supplier,
    loading,
    error,
    updateSupplier,
    refreshData: fetchCurrentSupplier
  }
}
