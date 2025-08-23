"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Client = {
  id: string
  name: string
  contact_email?: string
  contact_phone?: string
  created: string
}

const initialClients: Client[] = [
  { id: "c1", name: "TechCorp Solutions", contact_email: "hello@techcorp.com", created: "2025-07-20" },
  { id: "c2", name: "Acme Corp", contact_email: "contact@acme.com", created: "2025-07-18" },
  { id: "c3", name: "Test Client4", contact_email: "test4@example.com", created: "2025-07-17" },
  { id: "c4", name: "Blue Ocean Ltd", contact_email: "info@blueocean.com", created: "2025-06-09" },
  { id: "c5", name: "Greenfield LLC", contact_email: "team@greenfield.com", created: "2025-06-07" },
]

export default function ClientManagerPage() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<{ name: string; contact_email: string }>({ name: "", contact_email: "" })

  function startEdit(c: Client) {
    setEditingId(c.id)
    setFormState({ name: c.name, contact_email: c.contact_email || "" })
  }

  function cancelEdit() {
    setEditingId(null)
    setFormState({ name: "", contact_email: "" })
  }

  function saveEdit(id: string) {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, name: formState.name, contact_email: formState.contact_email } : c)))
    cancelEdit()
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-foreground">Client Manager</h1>
            <p className="text-sm text-muted-foreground">View and edit clients</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/admin/subadmin">
              <Button variant="ghost" size="sm">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription className="text-muted-foreground">Edit client name and contact email inline. (Local demo)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Contact Email</TableHead>
                <TableHead className="text-muted-foreground">Created</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    {editingId === c.id ? (
                      <Input value={formState.name} onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))} />
                    ) : (
                      <span className="text-foreground">{c.name}</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {editingId === c.id ? (
                      <Input value={formState.contact_email} onChange={(e) => setFormState((s) => ({ ...s, contact_email: e.target.value }))} />
                    ) : (
                      <span className="text-muted-foreground">{c.contact_email}</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="text-muted-foreground">{c.created}</span>
                  </TableCell>

                  <TableCell>
                    {editingId === c.id ? (
                      <div className="flex items-center space-x-2">
                        <Button size="sm" onClick={() => saveEdit(c.id)}>Save</Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button size="sm" onClick={() => startEdit(c)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => setClients((prev) => prev.filter((x) => x.id !== c.id))}>Delete</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
