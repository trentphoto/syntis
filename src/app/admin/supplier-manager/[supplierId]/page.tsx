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
import { useSecurityData } from "@/hooks/useSecurityData"
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
  const { securityData, loading: securityLoading, error: securityError, refreshData: refreshSecurityData } = useSecurityData(supplier?.domain || null)
  const [showAllIPs, setShowAllIPs] = useState(false)
  const [showAllPorts, setShowAllPorts] = useState(false)

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <ShieldIcon className="h-4 w-4" />
              Security
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

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Security Scorecard */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldIcon className="h-5 w-5" />
                      Security Scorecard
                    </CardTitle>
                    <CardDescription>Overall security posture and risk assessment</CardDescription>
                  </div>
                  {supplier?.domain && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={refreshSecurityData}
                      disabled={securityLoading}
                    >
                      {securityLoading ? "Refreshing..." : "Refresh Data"}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {securityLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">Loading security data...</p>
                  </div>
                ) : securityError ? (
                  <div className="text-center p-6">
                    <p className="text-destructive mb-2">{securityError}</p>
                    {supplier?.domain && (
                      <Button variant="outline" onClick={refreshSecurityData}>
                        Try Again
                      </Button>
                    )}
                  </div>
                ) : securityData ? (
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Overall Security Grade */}
                    <div className="text-center">
                      <div className={`text-6xl font-bold mb-2 ${
                        securityData.grade === 'A' ? 'text-green-600' :
                        securityData.grade === 'B' ? 'text-blue-600' :
                        securityData.grade === 'C' ? 'text-yellow-600' :
                        securityData.grade === 'D' ? 'text-orange-600' :
                        securityData.grade === 'F' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {securityData.grade}
                      </div>
                      <p className="text-sm text-muted-foreground">Security Grade</p>
                      <Badge variant="default" className={`mt-2 ${
                        securityData.grade === 'A' ? 'bg-green-100 text-green-800' :
                        securityData.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        securityData.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        securityData.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                        securityData.grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {securityData.grade === 'A' ? 'Excellent' :
                         securityData.grade === 'B' ? 'Good' :
                         securityData.grade === 'C' ? 'Fair' :
                         securityData.grade === 'D' ? 'Poor' :
                         securityData.grade === 'F' ? 'Critical' : 'Unknown'}
                      </Badge>
                    </div>
                    
                    {/* Security Score */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {Math.round(securityData.grade === 'A' ? 90 : 
                                    securityData.grade === 'B' ? 75 : 
                                    securityData.grade === 'C' ? 60 : 
                                    securityData.grade === 'D' ? 40 : 
                                    securityData.grade === 'F' ? 20 : 50)}
                      </div>
                      <p className="text-sm text-muted-foreground">Security Score</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ 
                          width: `${securityData.grade === 'A' ? 90 : 
                                    securityData.grade === 'B' ? 75 : 
                                    securityData.grade === 'C' ? 60 : 
                                    securityData.grade === 'D' ? 40 : 
                                    securityData.grade === 'F' ? 20 : 50}%` 
                        }}></div>
                      </div>
                    </div>
                    
                    {/* Risk Level */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-600 mb-2">
                        {securityData.vulnerabilities.length > 0 ? 
                          (securityData.vulnerabilities.some(v => v.severity === 'critical') ? 'Critical' :
                           securityData.vulnerabilities.some(v => v.severity === 'high') ? 'High' :
                           securityData.vulnerabilities.some(v => v.severity === 'medium') ? 'Medium' : 'Low') : 'Low'}
                      </div>
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <Badge variant="secondary" className={`mt-2 ${
                        securityData.vulnerabilities.some(v => v.severity === 'critical') ? 'bg-red-100 text-red-800' :
                        securityData.vulnerabilities.some(v => v.severity === 'high') ? 'bg-orange-100 text-orange-800' :
                        securityData.vulnerabilities.some(v => v.severity === 'medium') ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {securityData.vulnerabilities.some(v => v.severity === 'critical') ? 'Critical Risk' :
                         securityData.vulnerabilities.some(v => v.severity === 'high') ? 'High Risk' :
                         securityData.vulnerabilities.some(v => v.severity === 'medium') ? 'Medium Risk' : 'Low Risk'}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <p className="text-muted-foreground">No security data available</p>
                    {supplier?.domain && (
                      <Button variant="outline" onClick={refreshSecurityData}>
                        Scan Domain
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {/* TLS Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldIcon className="h-5 w-5" />
                    TLS Configuration
                  </CardTitle>
                  <CardDescription>Transport Layer Security details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {securityData ? (
                    <>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">TLS Version:</span>
                          <p className="font-medium">{securityData.tls.tls_version}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cipher:</span>
                          <p className="font-medium">{securityData.tls.cipher}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">HTTPS:</span>
                          <Badge variant="default" className={securityData.tls.https ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {securityData.tls.https ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Certificate:</span>
                          <p className="font-medium">{securityData.tls.days_left > 0 ? "Valid" : "Expired"}</p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <span className="text-muted-foreground text-sm">Days until expiry:</span>
                        <p className={`font-medium ${securityData.tls.days_left < 30 ? 'text-red-600' : securityData.tls.days_left < 90 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {securityData.tls.days_left} days
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No TLS data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Infrastructure Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BuildingIcon className="h-5 w-5" />
                    Infrastructure Security
                  </CardTitle>
                  <CardDescription>Network and server security details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {securityData ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Open Ports:</span>
                        <p className="font-medium">{securityData.ports.length} ports</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">WAF Detected:</span>
                        <Badge variant="outline" className={securityData.firewall.length > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {securityData.firewall.length > 0 ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Subdomains:</span>
                        <p className="font-medium">{securityData.subdomains.length} secured</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Blacklist Status:</span>
                        <Badge variant="default" className={securityData.blacklist.failed.length === 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {securityData.blacklist.failed.length === 0 ? "Clean" : "Blacklisted"}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No infrastructure data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Vulnerabilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldIcon className="h-5 w-5" />
                    Vulnerabilities
                  </CardTitle>
                  <CardDescription>Identified security issues</CardDescription>
                </CardHeader>
                <CardContent>
                  {securityData ? (
                    securityData.vulnerabilities.length > 0 ? (
                      <div className="space-y-3">
                        {securityData.vulnerabilities.map((vuln, index) => (
                          <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                            vuln.severity === 'critical' ? 'bg-red-50 border-red-200' :
                            vuln.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                            vuln.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                            'bg-blue-50 border-blue-200'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                vuln.severity === 'critical' ? 'bg-red-500' :
                                vuln.severity === 'high' ? 'bg-orange-500' :
                                vuln.severity === 'medium' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }`}></div>
                              <div>
                                <p className="font-medium text-sm">{vuln.name.en}</p>
                                <p className="text-xs text-muted-foreground">{vuln.description.en}</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className={`${
                              vuln.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              vuln.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              vuln.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {vuln.severity.charAt(0).toUpperCase() + vuln.severity.slice(1)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-green-600 font-medium">No vulnerabilities detected</p>
                        <p className="text-sm text-muted-foreground">This domain appears to be secure</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No vulnerability data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldIcon className="h-5 w-5" />
                    Security Recommendations
                  </CardTitle>
                  <CardDescription>Actionable security improvements</CardDescription>
                </CardHeader>
                <CardContent>
                  {securityData ? (
                    securityData.recommendations.en.length > 0 ? (
                      <div className="space-y-3">
                        {securityData.recommendations.en.map((rec, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <p className="text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-green-600 font-medium">No recommendations</p>
                        <p className="text-sm text-muted-foreground">Security posture is optimal</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No recommendation data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Additional Security Information */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Data Breach Monitor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldIcon className="h-5 w-5" />
                    Data Breach Monitor
                  </CardTitle>
                  <CardDescription>Account and email leak detection</CardDescription>
                </CardHeader>
                <CardContent>
                  {securityData ? (
                    <>
                      {/* Account Leaks */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${securityData.account_leaks.length > 0 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                          Account Leaks ({securityData.account_leaks.length})
                        </h4>
                        {securityData.account_leaks.length > 0 ? (
                          <div className="space-y-2">
                            {securityData.account_leaks.map((leak, index) => (
                              <div key={index} className="p-2 bg-red-50 rounded border border-red-200">
                                <p className="text-sm font-medium text-red-800">{leak.username}</p>
                                <p className="text-xs text-red-600">Hash: {leak.hash.substring(0, 8)}...</p>
                                <p className="text-xs text-red-600">
                                  Found: {new Date(leak.found_at * 1000).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-green-600">No account leaks detected</p>
                        )}
                      </div>

                      {/* Email Leaks */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${securityData.email_leaks.length > 0 ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                          Email Leaks ({securityData.email_leaks.length})
                        </h4>
                        {securityData.email_leaks.length > 0 ? (
                          <div className="space-y-2">
                            {securityData.email_leaks.map((leak, index) => (
                              <div key={index} className="p-2 bg-orange-50 rounded border border-orange-200">
                                <p className="text-sm font-medium text-orange-800">{leak.email}</p>
                                {leak.department && (
                                  <p className="text-xs text-orange-600">Dept: {leak.department}</p>
                                )}
                                <p className="text-xs text-orange-600">
                                  Found: {new Date(leak.found_at * 1000).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-green-600">No email leaks detected</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No breach data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Infrastructure Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BuildingIcon className="h-5 w-5" />
                    Infrastructure Details
                  </CardTitle>
                  <CardDescription>Operating system and network information</CardDescription>
                </CardHeader>
                <CardContent>
                  {securityData ? (
                    <div className="space-y-4">
                      {/* Security Significance Explanation */}
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          Infrastructure analysis reveals potential attack vectors, system vulnerabilities, and network architecture risks. 
                          Multiple IP addresses typically indicate load balancing or CDN implementation, while detected applications 
                          expose running services that may present security risks.
                        </p>
                      </div>

                      {/* Operating System */}
                      {securityData.os && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Operating System</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">OS:</span>
                              <p className="font-medium">{securityData.os.name} {securityData.os.version}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Vendor:</span>
                              <p className="font-medium">{securityData.os.vendor || 'Unknown'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Family:</span>
                              <p className="font-medium">{securityData.os.family}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Host:</span>
                              <p className="font-medium font-mono text-xs">{securityData.os.host}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Network IPs */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Network Infrastructure</h4>
                        <div className="space-y-2">
                          {securityData.ips.slice(0, 3).map((ip, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded border">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs">{ip.ip}</span>
                                <Badge variant="outline" className="text-xs">
                                  {ip.type}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{ip.as_name}</p>
                              <p className="text-xs text-muted-foreground">{ip.city}, {ip.country}</p>
                            </div>
                          ))}
                          {securityData.ips.length > 3 && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-xs"
                              onClick={() => setShowAllIPs(!showAllIPs)}
                            >
                              {showAllIPs ? 'Show Less' : `+${securityData.ips.length - 3} more IPs`}
                            </Button>
                          )}
                          
                          {showAllIPs && securityData.ips.length > 3 && (
                            <div className="space-y-2 mt-2">
                              {securityData.ips.slice(3).map((ip, index) => (
                                <div key={index + 3} className="p-2 bg-gray-50 rounded border">
                                  <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs">{ip.ip}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {ip.type}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{ip.as_name}</p>
                                  <p className="text-xs text-muted-foreground">{ip.city}, {ip.country}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Applications */}
                      {securityData.applications.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Detected Applications</h4>
                          <div className="space-y-2">
                            {securityData.applications.map((app, index) => (
                              <div key={index} className="p-2 bg-blue-50 rounded border border-blue-200">
                                <p className="text-sm font-medium">{app.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {app.host}:{app.port}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No infrastructure data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldIcon className="h-5 w-5" />
                    Security Analysis
                  </CardTitle>
                  <CardDescription>Detailed security assessment and company information</CardDescription>
                </CardHeader>
                <CardContent>
                  {securityData ? (
                    <div className="space-y-4">
                      {/* Score Reasons */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Score Justification</h4>
                        <div className="space-y-2">
                          {securityData.score_reason.en.slice(0, 4).map((reason, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <span className={`w-2 h-2 rounded-full mt-2 ${
                                reason.toLowerCase().includes('no') || reason.toLowerCase().includes('secure') || reason.toLowerCase().includes('strong') 
                                  ? 'bg-green-500' : 'bg-yellow-500'
                              }`}></span>
                              <p className="text-sm">{reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Company Information */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Company Information</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Category:</span>
                            <p className="font-medium">{securityData.info.category.split('/').pop()?.replace(/_/g, ' ')}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Global Rank:</span>
                            <p className="font-medium">#{securityData.info.global_rank.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Country Rank:</span>
                            <p className="font-medium">#{securityData.info.country_rank.rank.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Country:</span>
                            <p className="font-medium">{securityData.info.country_rank.country_code}</p>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Security Summary</h4>
                        <p className="text-sm text-muted-foreground">{securityData.summary.en}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No analysis data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Network Ports Detail */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BuildingIcon className="h-5 w-5" />
                    Network Ports
                  </CardTitle>
                  <CardDescription>Open ports and network services</CardDescription>
                </CardHeader>
                <CardContent>
                  {securityData ? (
                    <div className="space-y-4">
                      {/* Security Significance Explanation */}
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-800">
                          Open ports represent potential attack vectors, with each exposed service creating vulnerability opportunities. 
                          Elevated port counts expand the attack surface, while legacy protocols such as FTP (21) and Telnet (23) 
                          introduce inherent security risks.
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Open Ports: {securityData.ports.length}</span>
                        <Badge variant={securityData.ports.length > 20 ? "destructive" : securityData.ports.length > 10 ? "secondary" : "default"}>
                          {securityData.ports.length > 20 ? "High" : securityData.ports.length > 10 ? "Medium" : "Low"} Risk
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {securityData.ports.slice(0, 16).map((port, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded text-center">
                            <span className="text-sm font-mono">{port}</span>
                          </div>
                        ))}
                      </div>
                      
                      {securityData.ports.length > 16 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs"
                          onClick={() => setShowAllPorts(!showAllPorts)}
                        >
                          {showAllPorts ? 'Show Less' : `+${securityData.ports.length - 16} more ports`}
                        </Button>
                      )}

                      {showAllPorts && securityData.ports.length > 16 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {securityData.ports.slice(16).map((port, index) => (
                            <div key={index + 16} className="p-2 bg-gray-50 rounded text-center">
                              <span className="text-sm font-mono">{port}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Common Port Analysis */}
                      <div className="pt-2 border-t">
                        <h4 className="font-semibold text-sm mb-2">Common Services</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {securityData.ports.includes(80) && (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              <span>HTTP (80)</span>
                            </div>
                          )}
                          {securityData.ports.includes(443) && (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span>HTTPS (443)</span>
                            </div>
                          )}
                          {securityData.ports.includes(22) && (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                              <span>SSH (22)</span>
                            </div>
                          )}
                          {securityData.ports.includes(21) && (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              <span>FTP (21)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No port data available</p>
                    </div>
                  )}
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
