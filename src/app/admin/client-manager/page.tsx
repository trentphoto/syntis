"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"

type Client = {
  id: string
  name: string
  contact_email: string
  created_at: string | null
}

type CreateForm = {
  name: string
  contact_email?: string
  password?: string
}

export default function ClientManagerPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<{ name: string; contact_email: string }>({ name: "", contact_email: "" })
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const supabase = createClient()

  const { register, handleSubmit, reset, formState: rhfState } = useForm<CreateForm>()

  useEffect(() => {
    fetchClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchClients() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("clients").select("id,name,contact_email,created_at").order("created_at", { ascending: false })
      if (error) {
        console.log("Error fetching clients:", error)
        toast.error("Unable to load client list. Please try refreshing the page.")
        return
      }
      setClients((data || []) as Client[])
    } catch (err) {
      console.log("Unexpected error fetching clients:", err)
      toast.error("Failed to load clients. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  function startEdit(c: Client) {
    setEditingId(c.id)
    setFormState({ name: c.name, contact_email: c.contact_email || "" })
  }

  function cancelEdit() {
    setEditingId(null)
    setFormState({ name: "", contact_email: "" })
  }

  async function saveEdit(id: string) {
    setLoading(true)
    try {
      const { error } = await supabase.from("clients").update({ name: formState.name, contact_email: formState.contact_email }).eq("id", id)
      if (error) {
        console.log("Error updating client:", error)
        toast.error("Failed to update client information. Please try again.")
      } else {
        await fetchClients()
        cancelEdit()
        toast.success("Client information updated successfully!")
      }
    } catch (err) {
      console.log("Unexpected error updating client:", err)
      toast.error("Unable to save changes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function deleteClient(id: string) {
    if (!confirm("Delete this client? This cannot be undone.")) return
    setLoading(true)
    try {
      const { error } = await supabase.from("clients").delete().eq("id", id)
      if (error) {
        console.log("Error deleting client:", error)
        toast.error("Failed to delete client. Please try again.")
      } else {
        await fetchClients()
        toast.success("Client deleted successfully!")
      }
    } catch (err) {
      console.log("Unexpected error deleting client:", err)
      toast.error("Unable to delete client. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function onCreate(data: CreateForm) {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/create-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, contact_email: data.contact_email, password: data.password }),
      })

      const json = await res.json()
      if (!res.ok) {
        console.log("Error creating client:", json)
        toast.error(json?.error || "Failed to create client. Please check your input and try again.")
      } else {
        reset()
        await fetchClients()
        setIsDialogOpen(false)
        
        if (json.role_assigned) {
          toast.success("Client created successfully! User account and client role have been set up.")
        } else {
          toast.success("Client created successfully! User account created, but role assignment may need manual review.")
        }
      }
    } catch (err) {
      console.log("Unexpected error creating client:", err)
      toast.error("Unable to create client. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">

      <Link href="/" className="mb-4 inline-block">
        <Button variant="ghost" size="sm">
          <ArrowLeftIcon className="mr-1" />
          <span>Back to Dashboard</span>
        </Button>
      </Link>

      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-foreground">Client Manager</h1>
            <p className="text-sm text-muted-foreground">View and edit clients</p>
          </div>
            <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">Add Client</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Client</DialogTitle>
                    <DialogDescription>Provide client name and contact email.</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit(onCreate)} className="space-y-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input {...register("name", { required: true })} />
                      {rhfState.errors?.name && <p className="text-sm text-destructive">Name is required</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Email</label>
                      <Input {...register("contact_email", { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} />
                        {rhfState.errors?.contact_email && <p className="text-sm text-destructive">Enter a valid email</p>}
                      </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Password (optional)</label>
                      <Input type="password" {...register("password")} />
                      <p className="text-xs text-muted-foreground mt-1">If provided, this will be set as the client's initial password.</p>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription className="text-muted-foreground">Edit client name and contact email inline. Data comes from Supabase.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div />
            <div>
              <Button size="sm" onClick={() => fetchClients()} disabled={loading}>Refresh</Button>
            </div>
          </div>
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
                    <span className="text-muted-foreground">{c.created_at ? new Date(c.created_at).toISOString().slice(0, 10) : "-"}</span>
                  </TableCell>

                  <TableCell>
                    {editingId === c.id ? (
                      <div className="flex items-center space-x-2">
                        <Button size="sm" onClick={() => saveEdit(c.id)} disabled={loading}>Save</Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button size="sm" onClick={() => startEdit(c)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteClient(c.id)}>Delete</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {loading && <p className="text-sm text-muted-foreground mt-2">Loading...</p>}
        </CardContent>
      </Card>

  {/* old inline modal removed - using Dialog component above */}
    </div>
  )
}
