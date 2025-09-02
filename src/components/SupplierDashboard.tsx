"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BuildingIcon, 
  ShieldIcon, 
  SettingsIcon, 
  MoreHorizontalIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  EditIcon,
  ExternalLinkIcon,
  CreditCardIcon,
  PackageIcon
} from "lucide-react";
import { useCurrentSupplier } from "@/hooks/useCurrentSupplier";
import { useSecurityData } from "@/hooks/useSecurityData";
import SupplierDashboardSkeleton from "./SupplierDashboardSkeleton";

export default function SupplierDashboard() {
  const { supplier, loading, error, updateSupplier } = useCurrentSupplier();
  const { securityData, loading: securityLoading, error: securityError, refreshData: refreshSecurityData } = useSecurityData(supplier?.domain || null);
  const [isEditing, setIsEditing] = useState(false);
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
  });

  const [showAllIPs, setShowAllIPs] = useState(false);
  const [showAllPorts, setShowAllPorts] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("🔍 [SupplierDashboard] Component state:", {
      hasSupplier: !!supplier,
      supplierId: supplier?.id,
      supplierCompany: supplier?.company_name,
      loading,
      error,
      hasSecurityData: !!securityData,
      securityLoading,
      securityError
    });
  }, [supplier, loading, error, securityData, securityLoading, securityError]);

  // Initialize edit form when supplier data loads
  useEffect(() => {
    if (supplier) {
      console.log("📝 [SupplierDashboard] Initializing edit form with supplier data:", {
        company_name: supplier.company_name,
        contact_email: supplier.contact_email,
        contact_phone: supplier.contact_phone,
        address: supplier.address,
        business_type: supplier.business_type,
        ein: supplier.ein,
        domain: supplier.domain
      });
      
      setEditForm({
        company_name: supplier.company_name,
        contact_email: supplier.contact_email,
        contact_phone: supplier.contact_phone || "",
        address: supplier.address || "",
        business_type: supplier.business_type || "",
        ein: supplier.ein || "",
        domain: supplier.domain || ""
      });
    }
  }, [supplier]);

  const handleEdit = () => {
    console.log("✏️ [SupplierDashboard] Edit mode enabled");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    console.log("❌ [SupplierDashboard] Edit mode cancelled");
    setIsEditing(false);
    if (supplier) {
      setEditForm({
        company_name: supplier.company_name,
        contact_email: supplier.contact_email,
        contact_phone: supplier.contact_phone || "",
        address: supplier.address || "",
        business_type: supplier.business_type || "",
        ein: supplier.ein || "",
        domain: supplier.domain || ""
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!supplier) return;
    
    console.log("💾 [SupplierDashboard] Saving supplier edits:", editForm);
    const success = await updateSupplier(editForm);
    if (success) {
      console.log("✅ [SupplierDashboard] Supplier updated successfully");
      setIsEditing(false);
    } else {
      console.error("❌ [SupplierDashboard] Failed to update supplier");
    }
  };

  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskLevelBadge = (riskLevel: string | null | undefined) => {
    if (!riskLevel) return <Badge variant="outline">Unknown</Badge>;
    
    switch (riskLevel) {
      case 'low':
        return <Badge variant="default" className="bg-green-100 text-green-800">Low</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-orange-100 text-orange-800">High</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">{riskLevel}</Badge>;
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    console.log("⏳ [SupplierDashboard] Showing skeleton loading");
    return <SupplierDashboardSkeleton />;
  }

  if (error || !supplier) {
    console.log("❌ [SupplierDashboard] Showing error state:", { error, hasSupplier: !!supplier });
    return (
      <div className="space-y-8">
        {/* Debug Panel */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              🔍 Debug Information
            </CardTitle>
            <CardDescription className="text-orange-700">
              Troubleshooting information for supplier data loading
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-orange-700">Current State:</label>
                <div className="text-sm space-y-1">
                  <div>• Has Error: <span className="font-mono">{error ? 'Yes' : 'No'}</span></div>
                  <div>• Has Supplier: <span className="font-mono">{!!supplier ? 'Yes' : 'No'}</span></div>
                  <div>• Loading: <span className="font-mono">{loading ? 'Yes' : 'No'}</span></div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-orange-700">Error Details:</label>
                <div className="text-sm">
                  {error ? (
                    <span className="font-mono text-red-600">{error}</span>
                  ) : (
                    <span className="text-orange-600">No error message</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-orange-200">
              <h4 className="text-sm font-semibold text-orange-700 mb-2">Troubleshooting Steps:</h4>
              <ol className="text-sm text-orange-700 space-y-1 list-decimal list-inside">
                <li>Check browser console for detailed logs</li>
                <li>Verify user is authenticated with supplier role</li>
                <li>Check if supplier record exists in database</li>
                <li>Ensure supplier ID matches auth user ID</li>
                <li>Check database permissions and RLS policies</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              {error || "Supplier Not Found"}
            </h3>
            <p className="text-red-600 mb-4">
              {error 
                ? "There was an error loading your supplier information."
                : "We couldn't find your supplier profile in our system."
              }
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Please contact support if you believe this is an error.
              </p>
              <p className="text-sm text-muted-foreground">
                Reference: Check the debug panel above for more details.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("✅ [SupplierDashboard] Rendering dashboard with supplier:", {
    id: supplier.id,
    companyName: supplier.company_name,
    status: supplier.status
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {supplier.company_name}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(supplier.status)}
          {getRiskLevelBadge(supplier.overall_risk_level)}
        </div>
      </div>

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
                    <Button onClick={handleSaveEdit}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
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
        <TabsContent value="security" className="space-y-6 w-full">
          {/* Security Scorecard */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between w-full">
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
            <CardContent className="w-full">
              {securityLoading ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">Loading security data...</p>
                </div>
              ) : securityError || !securityData ? (
                <div className="text-center p-6">
                  <p className="text-muted-foreground mb-2">No security data available</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    This could be due to network issues or the domain not being configured.
                  </p>
                  {supplier?.domain && (
                    <Button variant="outline" onClick={refreshSecurityData}>
                      Try Again
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-3 w-full">
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
              )}
            </CardContent>
          </Card>

          {/* Security Details Grid */}
          <div className="grid gap-6 md:grid-cols-2 w-full">
            {/* TLS Configuration */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldIcon className="h-5 w-5" />
                  TLS Configuration
                </CardTitle>
                <CardDescription>Transport Layer Security details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 w-full">
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

            {/* Vulnerabilities */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldIcon className="h-5 w-5" />
                  Vulnerabilities
                </CardTitle>
                <CardDescription>Identified security issues</CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                {securityData ? (
                  securityData.vulnerabilities.length > 0 ? (
                    <div className="space-y-3">
                      {securityData.vulnerabilities.slice(0, 3).map((vuln, index) => (
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
                      {securityData.vulnerabilities.length > 3 && (
                        <p className="text-sm text-muted-foreground text-center">
                          +{securityData.vulnerabilities.length - 3} more vulnerabilities
                        </p>
                      )}
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
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your supplier profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline" size="lg">
                  <EditIcon className="h-4 w-4 mr-2" />
                  Edit Profile
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
                  <ShieldIcon className="h-4 w-4 mr-2" />
                  Security Report Settings
                </Button>
                <Button className="w-full" variant="outline" size="lg">
                  <ShieldIcon className="h-4 w-4 mr-2" />
                  Vulnerability Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* More Tab */}
        <TabsContent value="more" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Additional Features</CardTitle>
              <CardDescription>More functionality coming soon</CardDescription>
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
  );
}
