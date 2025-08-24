import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export type RiskFactor = {
  id: string
  name: string
  description: string | null
  factor_type: string | null
  risk_area_id: string | null
  weight: number | null
  is_active: boolean | null
  is_required: boolean | null
  ai_prompt_template: string | null
  configuration: any | null
  created_at: string | null
  updated_at: string | null
}

export type RiskArea = {
  id: string
  name: string
  description: string | null
  is_active: boolean | null
  weight: number | null
  created_at: string | null
}

export type CreateForm = {
  name: string
  description?: string
  risk_area_id?: string
  weight?: number
  is_active?: boolean
  is_required?: boolean
  ai_prompt_template?: string
}

export function useRiskFactorsManager() {
  const [loading, setLoading] = useState(true)
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([])
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<{
    name: string
    description: string
    risk_area_id: string
    weight: number | null
    is_active: boolean
    is_required: boolean
    ai_prompt_template: string
  }>({
    name: "",
    description: "",
    risk_area_id: "",
    weight: null,
    is_active: true,
    is_required: false,
    ai_prompt_template: ""
  })

  const supabase = createClient()

  const fetchRiskFactors = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("risk_factors")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) {
        console.error("Error fetching risk factors:", error)
        toast.error("Unable to load risk factors list. Please try refreshing the page.")
        return
      }
      setRiskFactors((data || []) as RiskFactor[])
    } catch (err) {
      console.error("Unexpected error fetching risk factors:", err)
      toast.error("Failed to load risk factors. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchRiskAreas = async () => {
    try {
      const { data, error } = await supabase
        .from("risk_areas")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true })
      
      if (error) {
        console.error("Error fetching risk areas:", error)
        toast.error("Unable to load risk areas. Please try refreshing the page.")
        return
      }
      setRiskAreas((data || []) as RiskArea[])
    } catch (err) {
      console.error("Unexpected error fetching risk areas:", err)
      toast.error("Failed to load risk areas. Please check your connection and try again.")
    }
  }

  const startEdit = (riskFactor: RiskFactor) => {
    setEditingId(riskFactor.id)
    setFormState({
      name: riskFactor.name,
      description: riskFactor.description || "",
      risk_area_id: riskFactor.risk_area_id || "",
      weight: riskFactor.weight,
      is_active: riskFactor.is_active ?? true,
      is_required: riskFactor.is_required ?? false,
      ai_prompt_template: riskFactor.ai_prompt_template || ""
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormState({
      name: "",
      description: "",
      risk_area_id: "",
      weight: null,
      is_active: true,
      is_required: false,
      ai_prompt_template: ""
    })
  }

  const saveEdit = async (id: string) => {
    setLoading(true)
    try {
      const dataToUpdate = {
        name: formState.name,
        description: formState.description || null,
        risk_area_id: formState.risk_area_id || null,
        weight: formState.weight,
        is_active: formState.is_active,
        is_required: formState.is_required,
        ai_prompt_template: formState.ai_prompt_template || null
      }
      
      const { error } = await supabase
        .from("risk_factors")
        .update(dataToUpdate)
        .eq("id", id)
      
      if (error) {
        console.error("Error updating risk factor:", error)
        toast.error("Failed to update risk factor information. Please try again.")
        return false
      } else {
        await fetchRiskFactors()
        cancelEdit()
        toast.success("Risk factor information updated successfully!")
        return true
      }
    } catch (err) {
      console.error("Unexpected error updating risk factor:", err)
      toast.error("Unable to save changes. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteRiskFactor = async (id: string) => {
    if (!confirm("Delete this risk factor? This cannot be undone.")) return false
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from("risk_factors")
        .delete()
        .eq("id", id)
      
      if (error) {
        console.error("Error deleting risk factor:", error)
        toast.error("Failed to delete risk factor. Please try again.")
        return false
      } else {
        await fetchRiskFactors()
        toast.success("Risk factor deleted successfully!")
        return true
      }
    } catch (err) {
      console.error("Unexpected error deleting risk factor:", err)
      toast.error("Unable to delete risk factor. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const createRiskFactor = async (data: CreateForm) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("risk_factors")
        .insert({
          name: data.name,
          description: data.description || null,
          risk_area_id: data.risk_area_id || null,
          weight: data.weight || null,
          is_active: data.is_active ?? true,
          is_required: data.is_required ?? false,
          ai_prompt_template: data.ai_prompt_template || null
        })
      
      if (error) {
        console.error("Error creating risk factor:", error)
        
        // Provide more specific error messages
        let errorMessage = "Failed to create risk factor. Please check your input and try again."
        
        if (error.code === "22P02") {
          errorMessage = "Invalid risk area ID. Please select a valid risk area."
        } else if (error.code === "23505") {
          errorMessage = "A risk factor with this name already exists."
        } else if (error.message) {
          errorMessage = error.message
        }
        
        toast.error(errorMessage)
        return false
      } else {
        await fetchRiskFactors()
        toast.success("Risk factor created successfully!")
        return true
      }
    } catch (err) {
      console.error("Unexpected error creating risk factor:", err)
      toast.error("Unable to create risk factor. Please check your connection and try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    loading,
    riskFactors,
    riskAreas,
    editingId,
    formState,
    
    // Actions
    fetchRiskFactors,
    fetchRiskAreas,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteRiskFactor,
    createRiskFactor,
    setFormState,
  }
}
