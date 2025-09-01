"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PencilIcon, PlusIcon, TrashIcon, ExternalLinkIcon, HomeIcon, BuildingIcon } from "lucide-react"
import { useSupplierManager, type CreateForm } from "@/hooks/useSupplierManager"
import { TableSkeleton } from "@/components/TableSkeleton"
import AdminNavClient from "@/components/AdminNavClient"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

export default function SupplierManagerPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([])
  const { 
    loading, 
    suppliers, 
    editingId, 
    formState, 
    fetchSuppliers, 
    startEdit, 
    cancelEdit, 
    saveEdit, 
    deleteSupplier, 
    createSupplier, 
    setFormState 
  } = useSupplierManager()

  const { register, handleSubmit, reset, formState: rhfState } = useForm<CreateForm>()

  useEffect(() => {
    fetchSuppliers()
    fetchClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchClients = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("clients")
        .select("id, name")
        .order("name", { ascending: true })
      
      if (error) {
        console.error("Error fetching clients:", error)
      } else {
        setClients(data || [])
      }
    } catch (err) {
      console.error("Unexpected error fetching clients:", err)
    }
  }

  async function onCreate(data: CreateForm) {
    const success = await createSupplier(data)
    if (success) {
      reset()
      setIsDialogOpen(false)
    }
  }

  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>
    
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRiskLevelBadge = (riskLevel: string | null | undefined) => {
    if (!riskLevel) return <Badge variant="outline">Unknown</Badge>
    
    switch (riskLevel) {
      case 'low':
        return <Badge variant="default" className="bg-green-100 text-green-800">Low</Badge>
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'high':
        return <Badge variant="destructive" className="bg-orange-100 text-orange-800">High</Badge>
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
      default:
        return <Badge variant="outline">{riskLevel}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavClient />
      
      <div className="p-6">

      <header className="mb-6">
        <Breadcrumbs 
          items={[
            { label: "Dashboard", href: "/", icon: <HomeIcon className="h-3 w-3" /> },
            { label: "Suppliers", icon: <BuildingIcon className="h-3 w-3" /> }
          ]}
          className="mb-4"
        />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-foreground">Supplier Manager</h1>
            <p className="text-sm text-muted-foreground">View and edit suppliers</p>
          </div>
            <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusIcon className="mr-1" />
                    Add Supplier
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Supplier</DialogTitle>
                    <DialogDescription>Provide supplier company information and contact details.</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit(onCreate)} className="space-y-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Company Name</label>
                      <Input {...register("company_name", { required: true })} />
                      {rhfState.errors?.company_name && <p className="text-sm text-destructive">Company name is required</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Email</label>
                      <Input {...register("contact_email", { 
                        required: true,
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                      })} />
                      {rhfState.errors?.contact_email && <p className="text-sm text-destructive">Enter a valid email</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Phone</label>
                      <Input {...register("contact_phone")} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <Input {...register("address")} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Business Type</label>
                      <Input {...register("business_type")} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">EIN</label>
                      <Input {...register("ein")} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Domain</label>
                      <Input {...register("domain")} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Assign to Client (optional)</label>
                      <select 
                        {...register("client_id")} 
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      >
                        <option value="">No client assignment</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">Select a client to associate this supplier with</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Password (optional)</label>
                      <Input type="password" {...register("password")} />
                      <p className="text-xs text-muted-foreground mt-1">If provided, this will be set as the supplier&apos;s initial password.</p>
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
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
          <CardDescription className="text-muted-foreground">Click on any supplier row to view full details. Edit supplier information inline. Data comes from Supabase.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div />
            <div>
              <Button size="sm" onClick={() => fetchSuppliers()} disabled={loading}>Refresh</Button>
            </div>
          </div>
          {loading ? (
            <TableSkeleton 
              rows={5} 
              columns={[
                { key: 'company_name', label: 'Company Name', skeletonWidth: 'w-32' },
                { key: 'contact_email', label: 'Contact Email', skeletonWidth: 'w-48' },
                { key: 'client', label: 'Client', skeletonWidth: 'w-24' },
                { key: 'status', label: 'Status', skeletonWidth: 'w-20' },
                { key: 'risk_level', label: 'Risk Level', skeletonWidth: 'w-20' },
                { key: 'created', label: 'Created', skeletonWidth: 'w-24' },
              ]} 
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">Company Name</TableHead>
                  <TableHead className="text-muted-foreground">Contact Email</TableHead>
                  <TableHead className="text-muted-foreground">Client</TableHead>
                  <TableHead className="text-muted-foreground">Relationship Status</TableHead>
                  <TableHead className="text-muted-foreground">Supplier Status</TableHead>
                  <TableHead className="text-muted-foreground">Risk Level</TableHead>
                  <TableHead className="text-muted-foreground">Created</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((s) => (
                  <TableRow 
                    key={s.id} 
                    className={editingId !== s.id ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={editingId !== s.id ? () => window.location.href = `/admin/supplier-manager/${s.id}` : undefined}
                  >
                    <TableCell>
                      {editingId === s.id ? (
                        <Input value={formState.company_name} onChange={(e) => setFormState((prev) => ({ ...prev, company_name: e.target.value }))} />
                      ) : (
                        <span className="text-foreground font-medium">{s.company_name}</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {editingId === s.id ? (
                        <Input value={formState.contact_email} onChange={(e) => setFormState((prev) => ({ ...prev, contact_email: e.target.value }))} />
                      ) : (
                        <span className="text-muted-foreground">{s.contact_email}</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {s.client ? (
                        <Link 
                          href={`/admin/client-manager/${s.client.id}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 hover:text-blue-600 transition-colors text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>{s.client.name}</span>
                          <ExternalLinkIcon className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">No client</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {s.relationship_status ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {s.relationship_status}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">No relationship</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(s.status)}
                    </TableCell>

                    <TableCell>
                      {getRiskLevelBadge(s.overall_risk_level)}
                    </TableCell>

                    <TableCell>
                      <span className="text-muted-foreground">{s.created_at ? new Date(s.created_at).toISOString().slice(0, 10) : "-"}</span>
                    </TableCell>

                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {editingId === s.id ? (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" onClick={() => saveEdit(s.id)} disabled={loading}>Save</Button>
                          <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancel</Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Button 
                            className="w-10 h-10 flex items-center justify-center bg-transparent shadow-none hover:bg-gray-100 text-gray-800" 
                            size="sm" 
                            onClick={() => startEdit(s)}
                            >
                            <PencilIcon className="mr-1" />
                          </Button>
                          <Button className="w-10 h-10 flex items-center justify-center bg-transparent shadow-none hover:bg-gray-100 text-red-500" size="sm" onClick={() => deleteSupplier(s.id)}>
                            <TrashIcon className="mr-1" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      </div>
    </div>
  )
}
