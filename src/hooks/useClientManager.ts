import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export type Client = {
  id: string
  name: string
  contact_email: string
  contact_phone?: string | null
  address?: string | null
  custom_branding?: unknown | null
  custom_business_types?: unknown | null
  custom_product_services?: unknown | null
  enrollment_benefits?: unknown | null
  enrollment_checklist?: unknown | null
  use_custom_options?: boolean | null
  user_id?: string | null
  supplier_count?: number
  created_at?: string | null
  updated_at?: string | null
}

export type CreateForm = {
  name: string
  contact_email?: string
  password?: string
}

export function useClientManager() {
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<{ name: string; contact_email: string }>({ name: "", contact_email: "" })

  const supabase = createClient()

  const fetchClients = async () => {
    setLoading(true)
    try {
      // First get all clients
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (clientsError) {
        console.error("Error fetching clients:", clientsError)
        toast.error("Unable to load client list. Please try refreshing the page.")
        return
      }

      // Get supplier counts for each client
      const clientsWithSupplierCounts = await Promise.all(
        (clientsData || []).map(async (client) => {
          const { count, error: countError } = await supabase
            .from("supplier_client_relationships")
            .select("*", { count: "exact", head: true })
            .eq("client_id", client.id)
            .eq("status", "active")

          if (countError) {
            console.error(`Error counting suppliers for client ${client.id}:`, countError)
            return { ...client, supplier_count: 0 }
          }

          return { ...client, supplier_count: count || 0 }
        })
      )

      setClients(clientsWithSupplierCounts as Client[])
    } catch (err) {
      console.error("Unexpected error fetching clients:", err)
      toast.error("Failed to load clients. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchClient = async (clientId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single()

      if (error) {
        console.error("Error fetching client:", error)
        toast.error("Unable to load client details")
        return null
      }

      return data as Client
    } catch (err) {
      console.error("Unexpected error fetching client:", err)
      toast.error("Failed to load client details")
      return null
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (client: Client) => {
    setEditingId(client.id)
    setFormState({ name: client.name, contact_email: client.contact_email || "" })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormState({ name: "", contact_email: "" })
  }

  const saveEdit = async (id: string, updateData?: { name: string; contact_email: string; contact_phone?: string; address?: string }) => {
    setLoading(true)
    try {
      const dataToUpdate = updateData || { 
        name: formState.name, 
        contact_email: formState.contact_email 
      }
      
      const { error } = await supabase
        .from("clients")
        .update(dataToUpdate)
        .eq("id", id)
      
      if (error) {
        console.error("Error updating client:", error)
        toast.error("Failed to update client information. Please try again.")
        return false
      } else {
        await fetchClients()
        if (!updateData) {
          cancelEdit()
        }
        toast.success("Client information updated successfully!")
        return true
      }
    } catch (err) {
      console.error("Unexpected error updating client:", err)
      toast.error("Unable to save changes. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteClient = async (id: string) => {
    if (!confirm("Delete this client? This cannot be undone.")) return false
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id)
      
      if (error) {
        console.error("Error deleting client:", error)
        toast.error("Failed to delete client. Please try again.")
        return false
      } else {
        await fetchClients()
        toast.success("Client deleted successfully!")
        return true
      }
    } catch (err) {
      console.error("Unexpected error deleting client:", err)
      toast.error("Unable to delete client. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const createNewClient = async (data: CreateForm) => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/create-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: data.name, 
          contact_email: data.contact_email, 
          password: data.password 
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        console.error("Error creating client:", json)
        toast.error(json?.error || "Failed to create client. Please check your input and try again.")
        return false
      } else {
        await fetchClients()
        
        if (json.role_assigned) {
          toast.success("Client created successfully! User account and client role have been set up.")
        } else {
          toast.success("Client created successfully! User account created, but role assignment may need manual review.")
        }
        return true
      }
    } catch (err) {
      console.error("Unexpected error creating client:", err)
      toast.error("Unable to create client. Please check your connection and try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    loading,
    clients,
    editingId,
    formState,
    
    // Actions
    fetchClients,
    fetchClient,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteClient,
    createClient: createNewClient,
    setFormState,
  }
}
