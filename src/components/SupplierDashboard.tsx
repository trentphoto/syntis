"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function SupplierDashboard() {
  // This would be fetched from the database in a real implementation
  const supplierData = {
    companyName: "Example Supplier Co.",
    status: "pending",
    contactEmail: "contact@examplesupplier.com",
    businessType: "Manufacturing",
    overallRiskLevel: "low",
    nextRenewalDate: "2024-12-31",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {supplierData.companyName}
          </p>
        </div>
        <Badge className={getStatusColor(supplierData.status)}>
          {supplierData.status.charAt(0).toUpperCase() + supplierData.status.slice(1)}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge className={getRiskLevelColor(supplierData.overallRiskLevel)}>
                {supplierData.overallRiskLevel.charAt(0).toUpperCase() + supplierData.overallRiskLevel.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Renewal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(supplierData.nextRenewalDate).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.ceil((new Date(supplierData.nextRenewalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Add missing information to your supplier profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Company Information</span>
                <Badge variant="outline">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Business Documents</span>
                <Badge variant="outline">Pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Risk Assessment</span>
                <Badge variant="outline">Not Started</Badge>
              </div>
            </div>
            <Button className="w-full mt-4" asChild>
              <Link href="/supplier/profile">Update Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>
              Upload and manage your business documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Business License</span>
                <Badge variant="outline">Not Uploaded</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Insurance Certificate</span>
                <Badge variant="outline">Not Uploaded</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tax Documents</span>
                <Badge variant="outline">Not Uploaded</Badge>
              </div>
            </div>
            <Button className="w-full mt-4" asChild>
              <Link href="/supplier/documents">Manage Documents</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Account Created</p>
                <p className="text-xs text-muted-foreground">
                  Your supplier account was created successfully
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Profile Review Required</p>
                <p className="text-xs text-muted-foreground">
                  Please complete your company profile for approval
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
