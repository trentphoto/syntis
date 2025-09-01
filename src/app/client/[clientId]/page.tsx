import { createClient } from "../../../lib/supabase/server";
import Link from "next/link";

type SupplierRow = {
  client_id: string;
  supplier_id: string;
  company_name: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  business_type?: string | null;
  supplier_status?: string | null;
  overall_risk_level?: string | null;
  ein?: string | null;
  domain?: string | null;
  program_package_id?: string | null;
  auto_renew_enabled?: boolean | null;
  next_renewal_date?: string | null;
  relationship_status?: string | null;
  relationship_start_date?: string | null;
  relationship_end_date?: string | null;
  relationship_notes?: string | null;
};

export default async function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const supabase = await createClient();

  // Await params in case it's a Promise (Next.js may provide params as a thenable in some flows)
  const resolvedParams = await params as { clientId: string };
  const clientId = resolvedParams.clientId;

  // Primary: fetch client by id
  const { data: clients, error: clientError } = await supabase
    .from("clients")
    .select("id, name, contact_email")
    .eq("id", clientId)
    .limit(1);

  if (clientError) {
    console.error("Failed to load client (primary):", clientError);
  }

  const client = clients && clients[0];

  // Fallbacks for troubleshooting: try id LIKE and name match (case-insensitive)
  let likeMatches = null;
  let nameMatches = null;

  if (!client) {
    try {
      const likeRes = await supabase
        .from("clients")
        .select("id, name, contact_email")
        .like("id", `${clientId}%`)
        .limit(5);
      likeMatches = likeRes.data;
    } catch (e) {
      console.error("like fallback failed", e);
    }

    try {
      const nameRes = await supabase
        .from("clients")
        .select("id, name, contact_email")
        .ilike("name", clientId)
        .limit(5);
      nameMatches = nameRes.data;
    } catch (e) {
      console.error("name fallback failed", e);
    }
  }

  if (!client) {
    // Render a diagnostic page to help troubleshoot the missing client
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Client — diagnostic</h1>
        <div className="mb-4">
          <div className="font-medium">Searched clientId:</div>
          <div className="text-sm text-gray-700">{clientId}</div>
        </div>

        <div className="mb-4">
          <div className="font-medium">Primary query result (eq id):</div>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-1">{JSON.stringify(clients, null, 2)}</pre>
        </div>

        <div className="mb-4">
          <div className="font-medium">Fallback — id LIKE:</div>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-1">{JSON.stringify(likeMatches, null, 2)}</pre>
        </div>

        <div className="mb-4">
          <div className="font-medium">Fallback — name ILIKE:</div>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-1">{JSON.stringify(nameMatches, null, 2)}</pre>
        </div>

        <div className="text-sm text-gray-500">
          If you expect this client to exist in the database, verify the id matches exactly the `clients.id` value
          (UUID) or try searching directly from the Supabase dashboard or with a REST call.
        </div>
      </div>
    );
  }

  // Query the `client_suppliers` view (joined view of suppliers + relationships)
  const { data: rows, error: viewError } = await supabase
    .from("client_suppliers")
    .select("*")
    .eq("client_id", client.id)
    .order("company_name", { ascending: true });

  if (viewError) {
    console.error("Failed to load client_suppliers view:", viewError);
  }

  const suppliers = (rows as SupplierRow[] | null) ?? null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">{client.name}</h1>
      <p className="text-sm text-gray-700 mb-4">{client.contact_email}</p>

      <h2 className="text-xl font-medium mb-2">Suppliers</h2>
      {suppliers && suppliers.length > 0 ? (
        <ul className="space-y-3">
          {(suppliers as SupplierRow[]).map((r) => (
            <li key={r.supplier_id} className="p-3 border rounded-md bg-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.company_name}</div>
                  <div className="text-sm text-gray-600">{r.contact_email}</div>
                  {r.contact_phone ? <div className="text-sm text-gray-600">{r.contact_phone}</div> : null}
                  {r.business_type ? <div className="text-sm text-gray-500">{r.business_type}</div> : null}
                </div>
                <div className="text-sm text-gray-500 text-right">
                  <div>Supplier: {r.supplier_status ?? "-"}</div>
                  <div>Risk level: {r.overall_risk_level ?? "-"}</div>
                  <div>Relationship: {r.relationship_status ?? "-"}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No suppliers found for this client.</p>
      )}

      <div className="mt-6">
        <Link href="/client" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 hover:text-blue-600 transition-colors text-xs">
          ← Back to clients
        </Link>
      </div>
    </div>
  );
}
