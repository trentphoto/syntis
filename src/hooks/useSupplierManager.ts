import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export type Supplier = {
  id: string
  company_name: string
  contact_email: string
  contact_phone?: string | null
  address?: string | null
  business_type?: string | null
  status?: 'pending' | 'active' | 'suspended' | 'rejected' | null
  overall_risk_level?: 'low' | 'medium' | 'high' | 'critical' | null
  ein?: string | null
  domain?: string | null
  program_package_id?: string | null
  auto_renew_enabled?: boolean | null
  next_renewal_date?: string | null
  auto_renew_payment_method?: string | null
  client_id?: string | null
  client?: { id: string; name: string } | null
  relationship_status?: string | null
  relationship_start_date?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type CreateForm = {
  company_name: string
  contact_email: string
  contact_phone?: string
  address?: string
  business_type?: string
  ein?: string
  domain?: string
  client_id?: string
  password?: string
}

export function useSupplierManager() {
  const [loading, setLoading] = useState(true)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<{ 
    company_name: string; 
    contact_email: string; 
    contact_phone: string; 
    address: string; 
    business_type: string; 
    ein: string; 
    domain: string; 
  }>({ 
    company_name: "", 
    contact_email: "", 
    contact_phone: "", 
    address: "", 
    business_type: "", 
    ein: "", 
    domain: "" 
  })

  const supabase = createClient()

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      // Get all suppliers with their client relationships
      const { data: suppliersData, error: suppliersError } = await supabase
        .from("suppliers")
        .select(`
          *,
          supplier_client_relationships!inner(
            client_id,
            status,
            relationship_start_date
          )
        `)
        .order("created_at", { ascending: false })
      
      if (suppliersError) {
        console.error("Error fetching suppliers:", suppliersError)
        toast.error("Unable to load supplier list. Please try refreshing the page.")
        return
      }

      // Extract unique client IDs from relationships
      const clientIds = new Set<string>()
      suppliersData?.forEach(supplier => {
        if (supplier.supplier_client_relationships) {
          supplier.supplier_client_relationships.forEach((rel: { client_id: string }) => {
            if (rel.client_id) {
              clientIds.add(rel.client_id)
            }
          })
        }
      })

      // Fetch client data for all relationships
      let clientData: { [key: string]: { id: string; name: string } } = {}
      if (clientIds.size > 0) {
        const { data: clientsData, error: clientsError } = await supabase
          .from("clients")
          .select("id, name")
          .in("id", Array.from(clientIds))
        
        if (!clientsError && clientsData) {
          clientData = clientsData.reduce((acc, client) => {
            acc[client.id] = client
            return acc
          }, {} as { [key: string]: { id: string; name: string } })
        }
      }

      // Merge the data - get the first active relationship for each supplier
      const suppliersWithClients = suppliersData?.map(supplier => {
        const activeRelationship = supplier.supplier_client_relationships?.find(
          (rel: { status: string; client_id: string; relationship_start_date: string | null }) => rel.status === 'active'
        )
        
        return {
          ...supplier,
          client: activeRelationship?.client_id ? clientData[activeRelationship.client_id] : null,
          relationship_status: activeRelationship?.status || null,
          relationship_start_date: activeRelationship?.relationship_start_date || null
        }
      }) || []

      setSuppliers(suppliersWithClients as Supplier[])
    } catch (err) {
      console.error("Unexpected error fetching suppliers:", err)
      toast.error("Failed to load suppliers. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchSupplier = async (supplierId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select(`
          *,
          supplier_client_relationships(
            client_id,
            status,
            relationship_start_date
          )
        `)
        .eq("id", supplierId)
        .single()

      if (error) {
        console.error("Error fetching supplier:", error)
        toast.error("Unable to load supplier details")
        return null
      }

      // Get the active relationship and fetch client data
      const activeRelationship = data.supplier_client_relationships?.find(
        (rel: { status: string; client_id: string; relationship_start_date: string | null }) => rel.status === 'active'
      )

      if (activeRelationship?.client_id) {
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("id, name")
          .eq("id", activeRelationship.client_id)
          .single()

        if (!clientError && clientData) {
          data.client = clientData
          data.relationship_status = activeRelationship.status
          data.relationship_start_date = activeRelationship.relationship_start_date
        }
      }

      return data as Supplier
    } catch (err) {
      console.error("Unexpected error fetching supplier:", err)
      toast.error("Failed to load supplier details")
      return null
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (supplier: Supplier) => {
    setEditingId(supplier.id)
    setFormState({ 
      company_name: supplier.company_name, 
      contact_email: supplier.contact_email || "", 
      contact_phone: supplier.contact_phone || "",
      address: supplier.address || "",
      business_type: supplier.business_type || "",
      ein: supplier.ein || "",
      domain: supplier.domain || ""
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormState({ 
      company_name: "", 
      contact_email: "", 
      contact_phone: "", 
      address: "", 
      business_type: "", 
      ein: "", 
      domain: "" 
    })
  }

  const saveEdit = async (id: string, updateData?: Partial<Supplier>) => {
    setLoading(true)
    try {
      const dataToUpdate = updateData || { 
        company_name: formState.company_name, 
        contact_email: formState.contact_email,
        contact_phone: formState.contact_phone || null,
        address: formState.address || null,
        business_type: formState.business_type || null,
        ein: formState.ein || null,
        domain: formState.domain || null
      }
      
      const { error } = await supabase
        .from("suppliers")
        .update(dataToUpdate)
        .eq("id", id)
      
      if (error) {
        console.error("Error updating supplier:", error)
        toast.error("Failed to update supplier information. Please try again.")
        return false
      } else {
        await fetchSuppliers()
        if (!updateData) {
          cancelEdit()
        }
        toast.success("Supplier information updated successfully!")
        return true
      }
    } catch (err) {
      console.error("Unexpected error updating supplier:", err)
      toast.error("Unable to save changes. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteSupplier = async (id: string) => {
    if (!confirm("Delete this supplier? This cannot be undone.")) return false
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from("suppliers")
        .delete()
        .eq("id", id)
      
      if (error) {
        console.error("Error deleting supplier:", error)
        toast.error("Failed to delete supplier. Please try again.")
        return false
      } else {
        await fetchSuppliers()
        toast.success("Supplier deleted successfully!")
        return true
      }
    } catch (err) {
      console.error("Unexpected error deleting supplier:", err)
      toast.error("Unable to delete supplier. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const createNewSupplier = async (data: CreateForm) => {
    setLoading(true)
    try {
      const res = await fetch("/api/supplier/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          companyName: data.company_name, 
          contactEmail: data.contact_email, 
          contactPhone: data.contact_phone,
          address: data.address,
          businessType: data.business_type,
          ein: data.ein,
          domain: data.domain,
          clientId: data.client_id,
          password: data.password 
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        console.error("Error creating supplier:", json)
        toast.error(json?.error || "Failed to create supplier. Please check your input and try again.")
        return false
      } else {
        await fetchSuppliers()
        
        if (json.temp_password) {
          toast.success(`Supplier created successfully! Temporary password: ${json.temp_password}`)
        } else {
          toast.success("Supplier created successfully!")
        }
        return true
      }
    } catch (err) {
      console.error("Unexpected error creating supplier:", err)
      toast.error("Unable to create supplier. Please check your connection and try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    loading,
    suppliers,
    editingId,
    formState,
    
    // Actions
    fetchSuppliers,
    fetchSupplier,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteSupplier,
    createSupplier: createNewSupplier,
    setFormState,
  }
}
