"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  BuildingIcon, 
  ShieldIcon, 
  CreditCardIcon, 
  PackageIcon,
  EditIcon,
  SaveIcon,
  XIcon
} from "lucide-react";
import { useCurrentSupplier } from "@/hooks/useCurrentSupplier";

export default function SupplierSettingsPage() {
  const { supplier, loading } = useCurrentSupplier();

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your supplier profile and preferences
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your supplier profile and preferences
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">Unable to load supplier details</p>
            <p className="text-muted-foreground">Please contact support if you believe this is an error.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your supplier profile and preferences
        </p>
      </div>

      <ProfileSettings />
      <SecuritySettings />
      <ProgramSettings />
    </div>
  );
}

function ProfileSettings() {
  const { supplier, updateSupplier } = useCurrentSupplier();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    company_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    business_type: "",
    ein: "",
    domain: ""
  });

  useEffect(() => {
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
  }, [supplier]);

  const handleSave = async () => {
    if (!supplier) return;
    
    const success = await updateSupplier(editForm);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
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

  if (!supplier) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BuildingIcon className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>Update your company information</CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <EditIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            {isEditing ? (
              <Input
                id="company_name"
                value={editForm.company_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, company_name: e.target.value }))}
              />
            ) : (
              <p className="text-sm text-muted-foreground">{supplier.company_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            {isEditing ? (
              <Input
                id="contact_email"
                type="email"
                value={editForm.contact_email}
                onChange={(e) => setEditForm(prev => ({ ...prev, contact_email: e.target.value }))}
              />
            ) : (
              <p className="text-sm text-muted-foreground">{supplier.contact_email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">Contact Phone</Label>
            {isEditing ? (
              <Input
                id="contact_phone"
                value={editForm.contact_phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, contact_phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{supplier.contact_phone || "Not provided"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_type">Business Type</Label>
            {isEditing ? (
              <Input
                id="business_type"
                value={editForm.business_type}
                onChange={(e) => setEditForm(prev => ({ ...prev, business_type: e.target.value }))}
                placeholder="Enter business type"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{supplier.business_type || "Not provided"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ein">EIN</Label>
            {isEditing ? (
              <Input
                id="ein"
                value={editForm.ein}
                onChange={(e) => setEditForm(prev => ({ ...prev, ein: e.target.value }))}
                placeholder="Enter EIN"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{supplier.ein || "Not provided"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            {isEditing ? (
              <Input
                id="domain"
                value={editForm.domain}
                onChange={(e) => setEditForm(prev => ({ ...prev, domain: e.target.value }))}
                placeholder="Enter domain"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{supplier.domain || "Not provided"}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          {isEditing ? (
            <Input
              id="address"
              value={editForm.address}
              onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter address"
            />
          ) : (
            <p className="text-sm text-muted-foreground">{supplier.address || "Not provided"}</p>
          )}
        </div>

        {isEditing && (
          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSave}>
              <SaveIcon className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <XIcon className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldIcon className="h-5 w-5" />
          Security Settings
        </CardTitle>
        <CardDescription>Configure security and monitoring preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Security Alerts</h4>
              <p className="text-sm text-muted-foreground">Receive notifications about security issues</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Vulnerability Notifications</h4>
              <p className="text-sm text-muted-foreground">Get alerts when new vulnerabilities are detected</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Security Reports</h4>
              <p className="text-sm text-muted-foreground">Schedule regular security reports</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgramSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackageIcon className="h-5 w-5" />
          Program Settings
        </CardTitle>
        <CardDescription>Manage your program package and billing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Payment Methods</h4>
              <p className="text-sm text-muted-foreground">Update your payment information</p>
            </div>
            <Button variant="outline" size="sm">
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto Renewal</h4>
              <p className="text-sm text-muted-foreground">Manage automatic renewal settings</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Program Package</h4>
              <p className="text-sm text-muted-foreground">View and manage your current package</p>
            </div>
            <Button variant="outline" size="sm">
              <PackageIcon className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
