"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { PlusIcon } from "lucide-react";
import { SupplierForm, type SupplierFormData } from "@/components/SupplierForm";

interface Supplier {
  id: string;
  company_name: string;
  contact_email: string;
  business_type?: string;
  status: string;
}

interface AddSupplierToClientDialogProps {
  clientId: string;
  clientName: string;
  onSupplierAdded: () => void;
}

type DialogMode = "select" | "create";

export function AddSupplierToClientDialog({ 
  clientId, 
  clientName, 
  onSupplierAdded 
}: AddSupplierToClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<DialogMode>("select");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    supplierId: "",
    relationshipStatus: "active",
    relationshipStartDate: new Date().toISOString().split('T')[0],
    relationshipEndDate: "",
    notes: "",
  });

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      // First get all suppliers
      const { data: allSuppliers, error: suppliersError } = await supabase
        .from("suppliers")
        .select("id, company_name, contact_email, business_type, status")
        .order("company_name", { ascending: true });

      if (suppliersError) {
        throw suppliersError;
      }

      // Then get existing relationships for this client
      const { data: existingRelationships, error: relationshipsError } = await supabase
        .from("supplier_client_relationships")
        .select("supplier_id")
        .eq("client_id", clientId);

      if (relationshipsError) {
        throw relationshipsError;
      }

      // Filter out suppliers that are already associated with this client
      const existingSupplierIds = new Set(existingRelationships?.map(r => r.supplier_id) || []);
      const availableSuppliers = allSuppliers?.filter(supplier => !existingSupplierIds.has(supplier.id)) || [];

      setSuppliers(availableSuppliers);
    } catch (err) {
      console.error("Error loading suppliers:", err);
      setError("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    if (open) {
      loadSuppliers();
    }
  }, [open, loadSuppliers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from("supplier_client_relationships")
        .insert({
          client_id: clientId,
          supplier_id: formData.supplierId,
          status: formData.relationshipStatus,
          relationship_start_date: formData.relationshipStartDate || null,
          relationship_end_date: formData.relationshipEndDate || null,
          notes: formData.notes || null,
        });

      if (error) {
        throw error;
      }

      // Reset form and close dialog
      setFormData({
        supplierId: "",
        relationshipStatus: "active",
        relationshipStartDate: new Date().toISOString().split('T')[0],
        relationshipEndDate: "",
        notes: "",
      });
      setMode("select");
      setOpen(false);
      onSupplierAdded();
    } catch (err) {
      console.error("Error adding supplier to client:", err);
      setError("Failed to add supplier to client");
    } finally {
      setSubmitting(false);
    }
  };

  const [createdSupplier, setCreatedSupplier] = useState<{
    companyName: string;
    email: string;
    tempPassword: string;
  } | null>(null);

  const handleCreateSupplier = async (supplierData: SupplierFormData) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/create-supplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: supplierData.companyName,
          contactEmail: supplierData.contactEmail,
          contactPhone: supplierData.contactPhone,
          address: supplierData.address,
          businessType: supplierData.businessType,
          ein: supplierData.ein,
          domain: supplierData.domain,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create supplier");
      }

      // Store the created supplier info to show credentials
      setCreatedSupplier({
        companyName: supplierData.companyName,
        email: supplierData.contactEmail,
        tempPassword: data.temp_password,
      });

      // Switch back to select mode and refresh suppliers
      setMode("select");
      await loadSuppliers();
    } catch (err) {
      console.error("Error creating supplier:", err);
      setError(err instanceof Error ? err.message : "Failed to create supplier");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setError(null);
      setMode("select");
      setCreatedSupplier(null);
      setFormData({
        supplierId: "",
        relationshipStatus: "active",
        relationshipStartDate: new Date().toISOString().split('T')[0],
        relationshipEndDate: "",
        notes: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Supplier to Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Supplier to {clientName}</DialogTitle>
          <DialogDescription>
            {mode === "select" 
              ? "Select an existing supplier or create a new one to associate with this client."
              : "Create a new supplier to add to this client."
            }
          </DialogDescription>
        </DialogHeader>
        
        {mode === "select" ? (
          <div className="space-y-4">
            {createdSupplier && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-800 mb-2">
                  ✅ Supplier Created Successfully!
                </h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Company:</strong> {createdSupplier.companyName}</p>
                  <p><strong>Email:</strong> {createdSupplier.email}</p>
                  <p><strong>Temporary Password:</strong> {createdSupplier.tempPassword}</p>
                  <p className="text-xs mt-2">
                    The supplier has been sent an invitation email. They can use these credentials to log in.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("create")}
                className="flex-1"
              >
                Create New Supplier
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Select Supplier *</Label>
                <Select
                  value={formData.supplierId}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, supplierId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <SelectItem value="loading" disabled>Loading suppliers...</SelectItem>
                    ) : suppliers.length === 0 ? (
                      <SelectItem value="no-suppliers" disabled>No available suppliers</SelectItem>
                    ) : (
                      suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{supplier.company_name}</span>
                            <span className="text-sm text-muted-foreground">
                              {supplier.contact_email}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationshipStatus">Relationship Status *</Label>
                <Select
                  value={formData.relationshipStatus}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, relationshipStatus: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.relationshipStartDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationshipStartDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.relationshipEndDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationshipEndDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this relationship..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || !formData.supplierId}>
                  {submitting ? "Adding..." : "Add Supplier"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("select")}
                className="flex-1"
              >
                ← Back to Select Supplier
              </Button>
            </div>

            <SupplierForm
              onSubmit={handleCreateSupplier}
              onCancel={() => setMode("select")}
              isLoading={submitting}
              error={error}
              submitButtonText="Create Supplier"
              showPasswordFields={false}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
