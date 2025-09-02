"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MailIcon, PhoneIcon, MapPinIcon, BuildingIcon, EditIcon, TrashIcon, ExternalLinkIcon, ShieldIcon, CreditCardIcon, PackageIcon, HomeIcon, SettingsIcon, MoreHorizontalIcon } from "lucide-react"
import { useSupplierManager, type Supplier } from "@/hooks/useSupplierManager"
import AdminNavClient from "@/components/AdminNavClient"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

export default function SupplierDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supplierId = params.supplierId as string
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<{ 
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

  const { fetchSupplier, saveEdit, deleteSupplier, loading: actionLoading } = useSupplierManager()

  const loadSupplier = useCallback(async () => {
    setLoading(true)
    const supplierData = await fetchSupplier(supplierId)
    if (supplierData) {
      setSupplier(supplierData)
      setEditForm({
        company_name: supplierData.company_name,
        contact_email: supplierData.contact_email,
        contact_phone: supplierData.contact_phone || "",
        address: supplierData.address || "",
        business_type: supplierData.business_type || "",
        ein: supplierData.ein || "",
        domain: supplierData.domain || ""
      })
    } else {
      setError("Failed to load supplier details")
    }
    setLoading(false)
  }, [supplierId, fetchSupplier])

  useEffect(() => {
    loadSupplier()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierId]) // Only depend on supplierId, not loadSupplier

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (supplier) {
      setEditForm({
        company_name: supplier.company_name,
        contact_email: supplier.contact_email,
        contact_phone: supplier.contact_phone || "",
        address: supplier.address || "",
        business_type: supplier.business_type || "",
        ein: supplier.ein || "",
        domain: supplier.domain || ""
      })
    }
  }

  const handleSaveEdit = async () => {
    if (!supplier) return
    
    const success = await saveEdit(supplier.id, editForm)
    if (success) {
      setIsEditing(false)
      await loadSupplier() // Refresh the supplier data
    }
  }

  const handleDelete = async () => {
    if (!supplier) return
    
    const success = await deleteSupplier(supplier.id)
    if (success) {
      router.push("/admin/supplier-manager")
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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not available"
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavClient />
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading supplier details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !supplier) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavClient />
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error || "Supplier not found"}</p>
              <Link href="/admin/supplier-manager" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 hover:text-blue-600 transition-colors text-xs">
                ← Return to Supplier Manager
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavClient />
      
      <div className="p-6">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Breadcrumbs 
                items={[
                  { label: "Dashboard", href: "/", icon: <HomeIcon className="h-3 w-3" /> },
                  { label: "Suppliers", href: "/admin/supplier-manager", icon: <BuildingIcon className="h-3 w-3" /> },
                  { label: supplier.company_name }
                ]}
                className="mb-2"
              />
              <h1 className="text-4xl font-bold text-foreground">{supplier.company_name}</h1>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span>ID:</span>
                <span className="font-mono bg-muted px-2 py-1 rounded">{supplier.id}</span>
              </span>
              <span>•</span>
              <span>Created {formatDate(supplier.created_at)}</span>
            </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(supplier.status)}
              {getRiskLevelBadge(supplier.overall_risk_level)}
            </div>
          </div>
        </header>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="more" className="flex items-center gap-2">
              <MoreHorizontalIcon className="h-4 w-4" />
              More
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BuildingIcon className="h-5 w-5" />
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
                        value={editForm.company_name} 
                        onChange={(e) => setEditForm(prev => ({ ...prev, company_name: e.target.value }))}
                        className="text-lg font-medium"
                      />
                    ) : (
                      <p className="text-lg font-medium text-foreground">{supplier.company_name}</p>
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
                      <p className="text-foreground font-medium">{supplier.contact_email}</p>
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
                      <p className="text-foreground font-medium">{supplier.contact_phone || "Not provided"}</p>
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
                      <p className="text-foreground">{supplier.address || "Not provided"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Business Type</label>
                    {isEditing ? (
                      <Input 
                        value={editForm.business_type} 
                        onChange={(e) => setEditForm(prev => ({ ...prev, business_type: e.target.value }))}
                        placeholder="Enter business type"
                      />
                    ) : (
                      <p className="text-foreground">{supplier.business_type || "Not provided"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">EIN</label>
                    {isEditing ? (
                      <Input 
                        value={editForm.ein} 
                        onChange={(e) => setEditForm(prev => ({ ...prev, ein: e.target.value }))}
                        placeholder="Enter EIN"
                      />
                    ) : (
                      <p className="text-foreground">{supplier.ein || "Not provided"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Domain</label>
                    {isEditing ? (
                      <Input 
                        value={editForm.domain} 
                        onChange={(e) => setEditForm(prev => ({ ...prev, domain: e.target.value }))}
                        placeholder="Enter domain"
                      />
                    ) : (
                      <p className="text-foreground">{supplier.domain || "Not provided"}</p>
                    )}
                  </div>

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

              {/* Status & Risk Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldIcon className="h-5 w-5" />
                    Status & Risk Information
                  </CardTitle>
                  <CardDescription>Current status and risk assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Status</label>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(supplier.status)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Overall Risk Level</label>
                    <div className="flex items-center gap-2">
                      {getRiskLevelBadge(supplier.overall_risk_level)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Program Package ID</label>
                    <p className="text-foreground font-mono text-sm bg-muted p-2 rounded">
                      {supplier.program_package_id || "Not assigned"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Auto Renewal</label>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${supplier.auto_renew_enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <p className="text-foreground font-medium">
                        {supplier.auto_renew_enabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>

                  {supplier.next_renewal_date && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Next Renewal Date</label>
                      <p className="text-foreground">{formatDate(supplier.next_renewal_date)}</p>
                    </div>
                  )}

                  {supplier.auto_renew_payment_method && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Auto Renewal Payment Method</label>
                      <p className="text-foreground">{supplier.auto_renew_payment_method}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Client Association */}
              <Card>
                <CardHeader>
                  <CardTitle>Client Association</CardTitle>
                  <CardDescription>Associated client information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Associated Client</label>
                    {supplier.client ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-medium">{supplier.client.name}</span>
                          <Link 
                            href={`/admin/client-manager/${supplier.client.id}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 hover:text-blue-600 transition-colors text-xs"
                          >
                            <span>View Client</span>
                            <ExternalLinkIcon className="h-3 w-3" />
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Relationship Status: </span>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              {supplier.relationship_status || 'Unknown'}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Start Date: </span>
                            <span className="text-foreground">
                              {supplier.relationship_start_date ? 
                                new Date(supplier.relationship_start_date).toLocaleDateString() : 
                                'Not specified'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No client associated</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>Timestamps and metadata</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Created Date
                      </label>
                      <p className="text-foreground">{formatDate(supplier.created_at)}</p>
                    </div>

                    {supplier.updated_at && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Last Updated</label>
                        <p className="text-foreground">{formatDate(supplier.updated_at)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                  <CardDescription>Manage this supplier</CardDescription>
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
                    Edit Supplier
                  </Button>
                  <Button className="w-full" variant="outline" size="lg">
                    View Risk Assessment
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
                    {actionLoading ? "Deleting..." : "Delete Supplier"}
                  </Button>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldIcon className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Configure security and monitoring</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline" size="lg">
                    <ShieldIcon className="h-4 w-4 mr-2" />
                    Configure Security Alerts
                  </Button>
                  <Button className="w-full" variant="outline" size="lg">
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Update Payment Methods
                  </Button>
                  <Button className="w-full" variant="outline" size="lg">
                    <PackageIcon className="h-4 w-4 mr-2" />
                    Manage Program Package
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* More Tab */}
          <TabsContent value="more" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Future Features</CardTitle>
                <CardDescription>Additional functionality coming soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Security Monitoring</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time security score monitoring and vulnerability tracking
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Risk Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced risk assessment and trend analysis
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Compliance Reporting</h4>
                    <p className="text-sm text-muted-foreground">
                      Automated compliance reports and audit trails
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Integration Hub</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with external security tools and APIs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
