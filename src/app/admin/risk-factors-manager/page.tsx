"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react"
import AdminNavClient from "@/components/AdminNavClient"
import { TableSkeleton } from "@/components/TableSkeleton"
import { useRiskFactorsManager, type CreateForm, type RiskArea } from "@/hooks/useRiskFactorsManager"

export default function RiskFactorsManagerPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { 
    loading, 
    riskFactors, 
    riskAreas,
    editingId, 
    formState, 
    fetchRiskFactors, 
    fetchRiskAreas,
    startEdit, 
    cancelEdit, 
    saveEdit, 
    deleteRiskFactor, 
    createRiskFactor, 
    setFormState 
  } = useRiskFactorsManager()

  const { register, handleSubmit, reset, formState: rhfState } = useForm<CreateForm>()

  useEffect(() => {
    fetchRiskFactors()
    fetchRiskAreas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onCreate(data: CreateForm) {
    setCreateError(null) // Clear any previous errors
    const success = await createRiskFactor(data)
    if (success) {
      reset()
      setIsDialogOpen(false)
    } else {
      // Set error message for display in modal
      setCreateError("Failed to create risk factor. Please check your input and try again.")
    }
  }

  const getRiskAreaName = (riskAreaId: string | null) => {
    if (!riskAreaId) return "-"
    const riskArea = riskAreas.find((ra: RiskArea) => ra.id === riskAreaId)
    return riskArea?.name || "-"
  }

  // Filter risk factors based on search term
  const filteredRiskFactors = riskFactors.filter((rf) =>
    rf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rf.description && rf.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background">
      <AdminNavClient />
      
      <div className="p-6">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-foreground">Risk Factors Manager</h1>
              <p className="text-sm text-muted-foreground">View and edit risk factors</p>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) {
                  setCreateError(null)
                  reset()
                }
              }}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusIcon className="mr-1" />
                    Add Risk Factor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Risk Factor</DialogTitle>
                    <DialogDescription>Create a new risk factor for supplier assessments.</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit(onCreate)} className="space-y-4 mt-2">
                    {createError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{createError}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium mb-1">Name *</label>
                      <Input {...register("name", { required: true })} />
                      {rhfState.errors?.name && <p className="text-sm text-destructive">Name is required</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Input {...register("description")} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Risk Area</label>
                      <select 
                        {...register("risk_area_id")} 
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="">Select a risk area</option>
                        {riskAreas.map((area: RiskArea) => (
                          <option key={area.id} value={area.id}>
                            {area.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Weight (1-10)</label>
                      <Input 
                        type="number" 
                        min="1" 
                        max="10" 
                        step="0.1"
                        {...register("weight", { 
                          min: 1, 
                          max: 10,
                          valueAsNumber: true 
                        })} 
                      />
                      {rhfState.errors?.weight && <p className="text-sm text-destructive">Weight must be between 1 and 10</p>}
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="is_active" 
                          {...register("is_active")}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium">Active</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="is_required" 
                          {...register("is_required")}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="is_required" className="text-sm font-medium">Required</label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">AI Prompt Template</label>
                      <textarea 
                        {...register("ai_prompt_template")}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm min-h-[80px]"
                        placeholder="Enter AI prompt template for this risk factor..."
                      />
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>All Risk Factors</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage risk factors for supplier assessments. Edit risk factor details inline. Data comes from Supabase.
            </CardDescription>
          </CardHeader>
                    <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search risk factors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div>
                <Button size="sm" onClick={() => fetchRiskFactors()} disabled={loading}>Refresh</Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {loading ? (
                <TableSkeleton 
                  rows={5} 
                  columns={[
                    { key: 'name', label: 'Name', skeletonWidth: 'w-32' },
                    { key: 'description', label: 'Description', skeletonWidth: 'w-40', minWidth: '150px' },
                    { key: 'riskArea', label: 'Risk Area', skeletonWidth: 'w-28' },
                    { key: 'weight', label: 'Weight', skeletonWidth: 'w-12' },
                    { key: 'active', label: 'Active', skeletonWidth: 'w-16' },
                    { key: 'required', label: 'Required', skeletonWidth: 'w-20' },
                    { key: 'aiPrompt', label: 'AI Prompt', skeletonWidth: 'w-12' },
                    { key: 'created', label: 'Created', skeletonWidth: 'w-24', minWidth: '100px' },
                  ]} 
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-muted-foreground">Name</TableHead>
                      <TableHead className="text-muted-foreground" style={{ minWidth: '150px' }}>Description</TableHead>
                      <TableHead className="text-muted-foreground">Risk Area</TableHead>
                      <TableHead className="text-muted-foreground">Weight</TableHead>
                      <TableHead className="text-muted-foreground">Active</TableHead>
                      <TableHead className="text-muted-foreground">Required</TableHead>
                                          <TableHead className="text-muted-foreground">AI Prompt</TableHead>
                    <TableHead className="text-muted-foreground" style={{ minWidth: '100px' }}>Created</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRiskFactors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? `No risk factors found matching "${searchTerm}".` : "No risk factors found. Create your first risk factor to get started."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRiskFactors.map((rf) => (
                      <TableRow key={rf.id}>
                        <TableCell>
                          {editingId === rf.id ? (
                            <Input 
                              value={formState.name} 
                              onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))} 
                            />
                          ) : (
                            <span className="text-foreground font-medium">{rf.name}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === rf.id ? (
                            <Input 
                              value={formState.description} 
                              onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))} 
                            />
                          ) : (
                            <span className="text-muted-foreground">
                              {rf.description || "-"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === rf.id ? (
                            <select 
                              value={formState.risk_area_id} 
                              onChange={(e) => setFormState((s) => ({ ...s, risk_area_id: e.target.value }))}
                              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                            >
                              <option value="">Select a risk area</option>
                              {riskAreas.map((area: RiskArea) => (
                                <option key={area.id} value={area.id}>
                                  {area.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-muted-foreground">
                              {getRiskAreaName(rf.risk_area_id)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === rf.id ? (
                            <Input 
                              type="number"
                              min="1"
                              max="10"
                              step="0.1"
                              value={formState.weight || ""} 
                              onChange={(e) => setFormState((s) => ({ ...s, weight: e.target.value ? parseFloat(e.target.value) : null }))} 
                            />
                          ) : (
                            <span className="text-muted-foreground">
                              {rf.weight || "-"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === rf.id ? (
                            <input 
                              type="checkbox"
                              checked={formState.is_active}
                              onChange={(e) => setFormState((s) => ({ ...s, is_active: e.target.checked }))}
                              className="rounded border-gray-300"
                            />
                          ) : (
                            <span className={`text-sm ${rf.is_active ? 'text-green-600' : 'text-red-600'}`}>
                              {rf.is_active ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === rf.id ? (
                            <input 
                              type="checkbox"
                              checked={formState.is_required}
                              onChange={(e) => setFormState((s) => ({ ...s, is_required: e.target.checked }))}
                              className="rounded border-gray-300"
                            />
                          ) : (
                            <span className={`text-sm ${rf.is_required ? 'text-blue-600' : 'text-gray-600'}`}>
                              {rf.is_required ? 'Required' : 'Optional'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === rf.id ? (
                            <textarea 
                              value={formState.ai_prompt_template} 
                              onChange={(e) => setFormState((s) => ({ ...s, ai_prompt_template: e.target.value }))}
                              className="w-full px-2 py-1 border border-input bg-background rounded text-xs min-h-[60px]"
                              placeholder="AI prompt template..."
                            />
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              {rf.ai_prompt_template ? 'Yes' : 'No'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">
                            {rf.created_at ? new Date(rf.created_at).toISOString().slice(0, 10) : "-"}
                          </span>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          {editingId === rf.id ? (
                            <div className="flex items-center space-x-2">
                              <Button size="sm" onClick={() => saveEdit(rf.id)} disabled={loading}>Save</Button>
                              <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancel</Button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Button 
                                className="w-8 h-8 flex items-center justify-center bg-transparent shadow-none hover:bg-gray-100 text-gray-800" 
                                size="sm" 
                                onClick={() => startEdit(rf)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button 
                                className="w-8 h-8 flex items-center justify-center bg-transparent shadow-none hover:bg-gray-100 text-red-500" 
                                size="sm" 
                                onClick={() => deleteRiskFactor(rf.id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
