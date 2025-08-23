import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

import MainNav from "@/components/MainNav";
import Footer from "@/components/footer";

import { InfoIcon, Users, DollarSign, Activity, FilePlus, Zap, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

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

  const totalRevenue = (renewalsData ?? []).reduce((sum, r: any) => {
    const amt = Number(r?.amount ?? 0) || 0;
    return sum + amt;
  }, 0);

  const activeAssessmentsInProgress = (assessmentsData ?? []).filter((a: any) => {
    const s = (a?.status ?? '').toLowerCase();
    return ['pending', 'in_progress', 'open'].includes(s);
  }).length;

  return (
    <main className="min-h-screen flex flex-col items-center">

      <MainNav />
    
      <div className="flex-1 w-full flex flex-col gap-12">
        <div className="w-full">
          <div className="bg-accent text-sm p-3 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size="16" strokeWidth={2} />
            Welcome to your Admin Dashboard. Here you can manage clients, view platform metrics, and perform administrative tasks.
          </div>
        </div>

        <div className="flex flex-col gap-2 items-start">
          <h2 className="font-bold text-2xl mb-4">Your user details</h2>
          <div className="flex gap-4 items-start">
            <div className="text-sm">
              <div className="font-medium">Role</div>
              <div className="text-xs text-foreground/80">{userRole?.role ?? 'No role assigned'}</div>
              {userRole?.assigned_at ? (
                <div className="text-foreground/60 text-xs">Assigned: {new Date(userRole.assigned_at).toLocaleString()}</div>
              ) : null}
            </div>

            <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
              {JSON.stringify(data.claims, null, 2)}
            </pre>
          </div>
        </div>

          <div>
            <Link href="/admin/subadmin" className="text-sm underline">
              <Button>
                Go to Sub-Admin Panel
              </Button>
            </Link>
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

                  <Link href="#/risk-overrides">
                    <Button variant="outline" className="flex items-center gap-2"><Zap /> Override risk scores</Button>
                  </Link>

                  <Link href="#/support/escalations">
                    <Button variant="outline" className="flex items-center gap-2"><LifeBuoy /> Support escalations</Button>
                  </Link>

                  <Link href="#/programs/deploy">
                    <Button variant="outline" className="flex items-center gap-2"><Zap /> Deploy program templates</Button>
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
                    <div className="text-xs text-muted-foreground mt-2">Active clients with at least one supplier: {activeClientsCount}</div>
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

          {/* Existing Clients table preserved below for detail */}
          <div className="flex flex-col gap-2 items-start">
            <h2 className="font-bold text-2xl mb-4">Clients</h2>
            {clientsError ? (
              <div className="text-red-600">Error fetching clients: {String(clientsError.message ?? clientsError)}</div>
      ) : typedClients && typedClients.length > 0 ? (
                <div className="overflow-x-auto w-full">
                  <table className="min-w-full border rounded shadow-sm bg-background">
                    <thead>
                      <tr className="bg-accent text-foreground/90">
                        <th className="px-4 py-2 text-left font-semibold">Name</th>
                        <th className="px-4 py-2 text-left font-semibold">Email</th>
                        <th className="px-4 py-2 text-left font-semibold">Phone</th>
                        <th className="px-4 py-2 text-left font-semibold">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                    {typedClients.map((client: ClientRow) => (
                      <tr key={client.id} className="border-b last:border-b-0 hover:bg-accent/30">
                      <td className="px-4 py-2 font-medium">{client.name}</td>
                      <td className="px-4 py-2">{client.contact_email}</td>
                      <td className="px-4 py-2">{client.contact_phone ?? <span className="text-foreground/50">—</span>}</td>
                      <td className="px-4 py-2 text-xs">{client.created_at ? new Date(client.created_at).toLocaleString() : "—"}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            ) : (
              <div className="text-sm text-foreground/70">No clients found. Ensure your `clients` table has public read access or check RLS policies.</div>
            )}
          </div>
      </div>

      <Footer />

    </main>
  );
}
