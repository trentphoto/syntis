"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export interface SupplierFormData {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  businessType: string;
  ein: string;
  domain: string;
  password: string;
  repeatPassword: string;
}

interface SupplierFormProps {
  onSubmit: (data: SupplierFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  submitButtonText?: string;
  showPasswordFields?: boolean;
}

export function SupplierForm({
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
  className,
  submitButtonText = "Create Supplier Account",
  showPasswordFields = true,
}: SupplierFormProps) {
  const [formData, setFormData] = useState<SupplierFormData>({
    companyName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    businessType: "",
    ein: "",
    domain: "",
    password: "",
    repeatPassword: "",
  });

  const handleInputChange = (field: keyof SupplierFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showPasswordFields) {
      if (formData.password !== formData.repeatPassword) {
        return;
      }

      if (formData.password.length < 8) {
        return;
      }
    }

    await onSubmit(formData);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          {/* Company Information */}
          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Company Information</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="Your Company Name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                placeholder="contact@company.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Business St, City, State ZIP"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                type="text"
                value={formData.businessType}
                onChange={(e) => handleInputChange("businessType", e.target.value)}
                placeholder="e.g., Manufacturing, Services, Retail"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ein">EIN (Employer Identification Number)</Label>
              <Input
                id="ein"
                type="text"
                value={formData.ein}
                onChange={(e) => handleInputChange("ein", e.target.value)}
                placeholder="12-3456789"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="domain">Company Website Domain</Label>
              <Input
                id="domain"
                type="text"
                value={formData.domain}
                onChange={(e) => handleInputChange("domain", e.target.value)}
                placeholder="company.com"
              />
            </div>
          </div>

          {/* Account Information - Only show if password fields are enabled */}
          {showPasswordFields && (
            <div className="grid gap-4">
              <h3 className="text-lg font-medium">Account Information</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Create a secure password"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="repeatPassword">Confirm Password *</Label>
                <Input
                  id="repeatPassword"
                  type="password"
                  required
                  value={formData.repeatPassword}
                  onChange={(e) => handleInputChange("repeatPassword", e.target.value)}
                  placeholder="Repeat your password"
                />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Creating..." : submitButtonText}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
