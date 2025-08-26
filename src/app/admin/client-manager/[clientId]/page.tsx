"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, MailIcon, PhoneIcon, MapPinIcon, UserIcon, EditIcon, TrashIcon, BuildingIcon } from "lucide-react"
import { useClientManager, type Client } from "@/hooks/useClientManager"
import AdminNavClient from "@/components/AdminNavClient"
import { AddSupplierToClientDialog } from "@/components/AddSupplierToClientDialog"

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params.clientId as string
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<{ name: string; contact_email: string; contact_phone: string; address: string }>({
    name: "",
    contact_email: "",
    contact_phone: "",
    address: ""
  })
  const [suppliers, setSuppliers] = useState<Array<{
    supplier_id: string;
    company_name: string;
    contact_email: string;
    business_type?: string;
    overall_risk_level?: 'low' | 'medium' | 'high';
    supplier_status?: 'active' | 'inactive';
    relationship_status?: 'active' | 'inactive';
    relationship_start_date?: string;
  }>>([])
  const [suppliersLoading, setSuppliersLoading] = useState(false)

  const { fetchClient, saveEdit, deleteClient, loading: actionLoading } = useClientManager()

  const loadSuppliers = useCallback(async (clientId: string) => {
    setSuppliersLoading(true)
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("client_suppliers")
        .select("*")
        .eq("client_id", clientId)
        .order("company_name", { ascending: true })

      if (error) {
        console.error("Error fetching suppliers:", error)
      } else {
        setSuppliers(data || [])
      }
    } catch (err) {
      console.error("Unexpected error fetching suppliers:", err)
    } finally {
      setSuppliersLoading(false)
    }
  }, [])

  const loadClient = useCallback(async () => {
    setLoading(true)
    const clientData = await fetchClient(clientId)
    if (clientData) {
      setClient(clientData)
      setEditForm({
        name: clientData.name,
        contact_email: clientData.contact_email,
        contact_phone: clientData.contact_phone || "",
        address: clientData.address || ""
      })
      await loadSuppliers(clientData.id)
    } else {
      setError("Failed to load client details")
    }
    setLoading(false)
  }, [clientId, fetchClient, loadSuppliers])

  useEffect(() => {
    loadClient()
  }, [loadClient])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (client) {
      setEditForm({
        name: client.name,
        contact_email: client.contact_email,
        contact_phone: client.contact_phone || "",
        address: client.address || ""
      })
    }
  }

  const handleSaveEdit = async () => {
    if (!client) return
    
    const success = await saveEdit(client.id, editForm)
    if (success) {
      setIsEditing(false)
      await loadClient() // Refresh the client data
    }
  }

  const handleDelete = async () => {
    if (!client) return
    
    const success = await deleteClient(client.id)
    if (success) {
      router.push("/admin/client-manager")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavClient />
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading client details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavClient />
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error || "Client not found"}</p>
              <Link href="/admin/client-manager">
                <Button>Return to Client Manager</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatJsonField = (field: unknown) => {
    if (!field) return "Not set"
    if (Array.isArray(field)) {
      return field.length === 0 ? "Empty array" : field.join(", ")
    }
    if (typeof field === "object") {
      return JSON.stringify(field, null, 2)
    }
    return String(field)
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not available"
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavClient />
      
      <div className="p-6">

      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">{client.name}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-mono bg-muted px-2 py-1 rounded">ID: {client.id}</span>
              <span>•</span>
              <span>Created {formatDate(client.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={client.use_custom_options ? "default" : "secondary"} className="text-sm px-3 py-1">
              {client.use_custom_options ? "Custom Options Enabled" : "Standard Options"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Basic Information
              </CardTitle>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <EditIcon className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Company Name</label>
              {isEditing ? (
                <Input 
                  value={editForm.name} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="text-lg font-medium"
                />
              ) : (
                <p className="text-lg font-medium text-foreground">{client.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <MailIcon className="h-4 w-4" />
                Contact Email
              </label>
              {isEditing ? (
                <Input 
                  value={editForm.contact_email} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, contact_email: e.target.value }))}
                  type="email"
                />
              ) : (
                <p className="text-foreground font-medium">{client.contact_email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                Contact Phone
              </label>
              {isEditing ? (
                <Input 
                  value={editForm.contact_phone} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, contact_phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="text-foreground font-medium">{client.contact_phone || "Not provided"}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                Address
              </label>
              {isEditing ? (
                <Input 
                  value={editForm.address} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter address"
                />
              ) : (
                <p className="text-foreground">{client.address || "Not provided"}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Created Date
              </label>
              <p className="text-foreground">{formatDate(client.created_at)}</p>
            </div>

            {client.updated_at && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Last Updated</label>
                <p className="text-foreground">{formatDate(client.updated_at)}</p>
              </div>
            )}

            {client.user_id && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">User ID</label>
                <p className="text-foreground font-mono text-sm bg-muted p-2 rounded">{client.user_id}</p>
              </div>
            )}

            {isEditing && (
              <div className="flex items-center gap-3 pt-4">
                <Button onClick={handleSaveEdit} disabled={actionLoading}>
                  {actionLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={handleCancelEdit} disabled={actionLoading}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Configuration</CardTitle>
            <CardDescription>Client-specific settings and customizations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Use Custom Options</label>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${client.use_custom_options ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <p className="text-foreground font-medium">
                  {client.use_custom_options ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Custom Business Types</label>
              <div className="p-4 bg-muted rounded-lg border">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                  {formatJsonField(client.custom_business_types)}
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Custom Product/Services</label>
              <div className="p-4 bg-muted rounded-lg border">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                  {formatJsonField(client.custom_product_services)}
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Custom Branding</label>
              <div className="p-4 bg-muted rounded-lg border">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                  {formatJsonField(client.custom_branding)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Settings</CardTitle>
            <CardDescription>Benefits and checklist for client enrollment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Enrollment Benefits</label>
              <div className="p-4 bg-muted rounded-lg border">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                  {formatJsonField(client.enrollment_benefits)}
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Enrollment Checklist</label>
              <div className="p-4 bg-muted rounded-lg border">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                  {formatJsonField(client.enrollment_checklist)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Manage this client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              variant="outline" 
              size="lg"
              onClick={handleEdit}
              disabled={isEditing || actionLoading}
            >
              <EditIcon className="h-4 w-4 mr-2" />
              Edit Client
            </Button>
            <Button className="w-full" variant="outline" size="lg">
              View Suppliers
            </Button>
            <Button className="w-full" variant="outline" size="lg">
              Export Data
            </Button>
            <Button 
              className="w-full" 
              variant="destructive" 
              size="lg"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {actionLoading ? "Deleting..." : "Delete Client"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers Table */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BuildingIcon className="h-5 w-5" />
                  Associated Suppliers
                </CardTitle>
                <CardDescription>
                  All suppliers associated with this client
                </CardDescription>
              </div>
              <AddSupplierToClientDialog 
                clientId={client.id} 
                clientName={client.name} 
                onSupplierAdded={() => loadSuppliers(client.id)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {suppliersLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading suppliers...</p>
              </div>
            ) : suppliers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Business Type</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Start Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.supplier_id}>
                      <TableCell className="font-medium">
                        {supplier.company_name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {supplier.contact_email || "N/A"}
                      </TableCell>
                      <TableCell>
                        {supplier.business_type || "N/A"}
                      </TableCell>
                      <TableCell>
                        {supplier.overall_risk_level ? (
                          <Badge 
                            variant={
                              supplier.overall_risk_level === 'low' ? 'default' :
                              supplier.overall_risk_level === 'medium' ? 'secondary' :
                              supplier.overall_risk_level === 'high' ? 'destructive' : 'outline'
                            }
                          >
                            {supplier.overall_risk_level}
                          </Badge>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {supplier.supplier_status ? (
                          <Badge 
                            variant={
                              supplier.supplier_status === 'active' ? 'default' :
                              supplier.supplier_status === 'inactive' ? 'secondary' : 'outline'
                            }
                          >
                            {supplier.supplier_status}
                          </Badge>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {supplier.relationship_status ? (
                          <Badge 
                            variant={
                              supplier.relationship_status === 'active' ? 'default' :
                              supplier.relationship_status === 'inactive' ? 'secondary' : 'outline'
                            }
                          >
                            {supplier.relationship_status}
                          </Badge>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {supplier.relationship_start_date ? (
                          new Date(supplier.relationship_start_date).toLocaleDateString()
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <BuildingIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No suppliers associated with this client</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}
