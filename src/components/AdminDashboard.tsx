import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

import MainNav from "@/components/MainNav";
import Footer from "@/components/footer";
import AdminNavClient from "@/components/AdminNavClient";

import { InfoIcon, Users, DollarSign, Activity, FilePlus, Zap, LifeBuoy, ArrowRight, UserPlus, Target, BarChart3, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminDashboardClient from './AdminDashboardClient'; // Dynamically imported client-side component

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Tables } from '@/types/supabase';

export const metadata: Metadata = {
  title: "SyNtis Admin Panel",
  description: "",
};

export default async function AdminDashboard() {

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Extract user id from common JWT claim keys (supabase uses `sub`)
  const claims = data.claims as Record<string, any>;
  const userId = claims?.sub ?? claims?.user_id ?? claims?.userId ?? null;

  // Fetch the user's active role from `user_roles`. Use maybeSingle since a role may not exist.
  type UserRoleRow = { role: string | null; assigned_at: string | null; is_active: boolean | null };
  let userRole: UserRoleRow | null = null;
  if (userId) {
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role, assigned_at, is_active')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle();

    if (roleError) {
      console.error('Error fetching user role', roleError);
    } else {
      userRole = (roleData as unknown) as UserRoleRow | null;
    }
  }

  // Query the `clients` table from the user's schema
  const { data: clients, error: clientsError } = await supabase.from("clients").select(
    `id, name, contact_email, contact_phone, created_at`
  );

  // Strongly type the returned rows using generated DB types
  type ClientRow = Tables<"clients">;
  const typedClients = (clients as unknown) as ClientRow[] | null;

  // Fetch client_suppliers view for better relationship data
  const { data: clientSuppliersData, error: clientSuppliersError } = await supabase
    .from('client_suppliers')
    .select('client_id, supplier_id, relationship_start_date, relationship_status, supplier_status');

  type ClientSupplierRow = Tables<'client_suppliers'>;
  const typedClientSuppliers = (clientSuppliersData as unknown) as ClientSupplierRow[] | null;

  // Fetch suppliers (used for total suppliers and active clients calculation)
  const { data: suppliersData, error: suppliersError } = await supabase
    .from('suppliers')
    .select('id, client_id, status');

  type SupplierRow = Tables<'suppliers'>;
  const typedSuppliers = (suppliersData as unknown) as SupplierRow[] | null;

  // Fetch renewal history to compute revenue
  const { data: renewalsData } = await supabase
    .from('renewal_history')
    .select('amount, status');

  // Fetch active risk assessments
  const { data: assessmentsData } = await supabase
    .from('supplier_risk_assessments')
    .select('id, status');

  // Compute metrics safely on the server
  const totalClientsCount = typedClients ? typedClients.length : 0;
  const totalSuppliersEnrolled = typedSuppliers ? typedSuppliers.filter(s => s.client_id).length : 0;
  const activeClientsCount = typedSuppliers ? new Set(typedSuppliers.filter(s => s.client_id).map(s => s.client_id)).size : 0;

  // Calculate the 5 Client & Supplier Management KPIs
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const ninetyDaysAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));

  // 1. Total Active Clients (clients with at least one enrolled supplier)
  const totalActiveClients = typedClientSuppliers ? 
    new Set(typedClientSuppliers.filter(cs => cs.relationship_status === 'active').map(cs => cs.client_id)).size : 0;

  // 2. New Clients This Month
  const newClientsThisMonth = typedClients ? 
    typedClients.filter(client => {
      if (!client.created_at) return false;
      const createdDate = new Date(client.created_at);
      return createdDate >= firstDayOfMonth;
    }).length : 0;

  // 3. Client Retention Rate (clients with 90+ day relationships)
  const clientsWithLongTermRelationships = typedClientSuppliers ? 
    new Set(typedClientSuppliers.filter(cs => {
      if (!cs.relationship_start_date || cs.relationship_status !== 'active') return false;
      const startDate = new Date(cs.relationship_start_date);
      return startDate <= ninetyDaysAgo;
    }).map(cs => cs.client_id)).size : 0;
  
  const clientRetentionRate = totalActiveClients > 0 ? 
    Math.round((clientsWithLongTermRelationships / totalActiveClients) * 100) : 0;

  // 4. Average Suppliers per Client
  const averageSuppliersPerClient = totalActiveClients > 0 ? 
    totalSuppliersEnrolled / totalActiveClients : 0;

  // 5. Supplier Enrollment Rate (active vs total suppliers)
  const totalSuppliers = typedSuppliers ? typedSuppliers.length : 0;
  const activeSuppliers = typedSuppliers ? 
    typedSuppliers.filter(s => s.status === 'active').length : 0;
  const supplierEnrollmentRate = totalSuppliers > 0 ? 
    Math.round((activeSuppliers / totalSuppliers) * 100) : 0;

  const totalRevenue = (renewalsData ?? []).reduce((sum, r: any) => {
    const amt = Number(r?.amount ?? 0) || 0;
    return sum + amt;
  }, 0);

  const activeAssessmentsInProgress = (assessmentsData ?? []).filter((a: any) => {
    const s = (a?.status ?? '').toLowerCase();
    return ['pending', 'in_progress', 'open'].includes(s);
  }).length;

  // Prepare KPI data for client component
  const kpiData = {
    totalActiveClients,
    newClientsThisMonth,
    clientRetentionRate,
    averageSuppliersPerClient,
    supplierEnrollmentRate
  };

  return (
    <main className="min-h-screen flex flex-col items-center">

      <MainNav header="Admin Dashboard" />
    
      <div className="flex-1 w-full flex flex-col gap-12">

        <AdminNavClient />

        <div className="w-full">
          <div className="bg-accent text-sm p-3 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size="16" strokeWidth={2} />
            Welcome to your Admin Dashboard. Here you can manage clients, view platform metrics, and perform administrative tasks.
          </div>
        </div>

        {/* Client & Supplier Management KPI Cards - Moved to top */}
        <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpiData.totalActiveClients}</div>
              <p className="text-xs text-muted-foreground">Clients with enrolled suppliers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New Clients This Month</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpiData.newClientsThisMonth}</div>
              <p className="text-xs text-muted-foreground">Clients created this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Client Retention Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpiData.clientRetentionRate}%</div>
              <p className="text-xs text-muted-foreground">90+ day relationships</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Suppliers per Client</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpiData.averageSuppliersPerClient.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Average enrollment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Supplier Enrollment Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpiData.supplierEnrollmentRate}%</div>
              <p className="text-xs text-muted-foreground">Completed enrollments</p>
            </CardContent>
          </Card>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">

          <Card>
            <CardHeader>
              <CardTitle>Your user details</CardTitle>
              <CardDescription className="text-sm">Role and JWT claims</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-sm mb-4">
                  <div className="font-medium">Role</div>
                  <div className="text-xs text-foreground/80">{userRole?.role ?? 'No role assigned'}</div>
                  {userRole?.assigned_at ? (
                    <div className="text-foreground/60 text-xs">Assigned: {new Date(userRole.assigned_at).toLocaleString()}</div>
                  ) : null}
                </div>

                <pre className="text-xs font-mono p-3 rounded border border-gray-700 bg-gray-200">
                  {JSON.stringify(data.claims, null, 2)}
                </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              Header
            </CardHeader>
            <CardContent>
              Content
            </CardContent>
          </Card>

        </div>

          {/* Quick Actions */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common admin tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-3">
                  <Link href="/admin/client-manager">
                    <Button variant="outline" className="flex items-center gap-2"><FilePlus /> Create new client</Button>
                  </Link>

                  <Link href="/risk-scores">
                    <Button variant="outline" className="flex items-center gap-2"><Zap /> Risk scores</Button>
                  </Link>

                  <Link href="/support">
                    <Button variant="outline" className="flex items-center gap-2"><LifeBuoy />Support tickets</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Core Metrics Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Core Metrics</CardTitle>
                <CardDescription>Platform snapshot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Total clients</div>
                        <div className="text-2xl font-bold">{totalClientsCount}</div>
                      </div>
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    {/* moved active clients stat into its own card below */}
                  </div>
                  
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Active clients</div>
                        <div className="text-2xl font-bold">{activeClientsCount}</div>
                      </div>
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Clients that have at least one enrolled supplier</div>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Suppliers enrolled</div>
                        <div className="text-2xl font-bold">{totalSuppliersEnrolled}</div>
                      </div>
                      <Activity className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Across all clients</div>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Platform revenue</div>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                      </div>
                      <DollarSign className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">All recorded renewals</div>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Active risk assessments</div>
                        <div className="text-2xl font-bold">{activeAssessmentsInProgress}</div>
                      </div>
                      <InfoIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Assessments currently in progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clients section */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Clients</CardTitle>
              <CardDescription className="text-muted-foreground">Preview of recent clients. Click "Manage clients" for full management capabilities.</CardDescription>
            </CardHeader>
            <CardContent>
              {clientsError ? (
                <div className="text-red-600">Error fetching clients: {String(clientsError.message ?? clientsError)}</div>
              ) : typedClients && typedClients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-muted-foreground">Name</TableHead>
                      <TableHead className="text-muted-foreground">Contact Email</TableHead>
                      <TableHead className="text-muted-foreground">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {typedClients.slice(0, 5).map((client: ClientRow) => (
                      <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <span className="text-foreground font-medium">{client.name}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">{client.contact_email}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">{client.created_at ? new Date(client.created_at).toISOString().slice(0, 10) : "-"}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-sm text-foreground/70">No clients found. Ensure your `clients` table has public read access or check RLS policies.</div>
              )}
              <div className="flex justify-start mt-4">
                <Button asChild variant="default">
                  <Link href="/admin/client-manager">
                    Manage clients
                    <ArrowRight className="mr-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* divider */}
      <div className="w-full border-t border-border my-8" />

      {/* Render the client-side admin UI (charts, audit, client quick view) */}
      {/* Imported dynamically to avoid SSR issues with Recharts which requires window */}
      <div className="w-full">
        <p>Client-side only admin UI (charts, audit, quick views)</p>
        <p>Dynamically import without SSR because Recharts requires window</p>
        <p>The dynamic import is defined below to keep top-level imports tidy</p>

        <div className="w-full border-t border-border my-8" />

        <AdminDashboardClient />
      </div>

      <Footer />

    </main>
  );
}
