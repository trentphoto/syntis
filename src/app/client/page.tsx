import { createClient } from "../../lib/supabase/server";
import Link from "next/link";

export default async function ClientPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, contact_email, contact_phone, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    // Log server-side and render a brief message to the UI
    // (Detailed errors should go to server logs in production)
    console.error("Failed to load clients:", error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Clients</h1>
        <div className="text-red-600">Failed to load clients.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Clients</h1>

      {data && data.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((c) => (
            <li key={c.id} className="">
              <Link
                href={`/client/${c.id}`}
                className="block p-4 border rounded-md bg-white/50 shadow-sm hover:shadow-md transition"
              >
                <h2 className="font-medium text-lg">{c.name}</h2>
                <p className="text-sm text-gray-700">{c.contact_email}</p>
                {c.contact_phone ? (
                  <p className="text-sm text-gray-600">{c.contact_phone}</p>
                ) : null}
                {c.id ? (
                  <p className="text-xs text-gray-500 mt-1">ID: {c.id}</p>
                ) : null}
                {c.created_at ? (
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(c.created_at).toLocaleString()}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No clients found.</p>
      )}
    </div>
  );
}
