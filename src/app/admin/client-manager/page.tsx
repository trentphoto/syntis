"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PencilIcon, PlusIcon, TrashIcon, HomeIcon, UserIcon } from "lucide-react"
import { useClientManager, type CreateForm } from "@/hooks/useClientManager"
import { TableSkeleton } from "@/components/TableSkeleton"
import AdminNavClient from "@/components/AdminNavClient"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

export default function ClientManagerPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { 
    loading, 
    clients, 
    editingId, 
    formState, 
    fetchClients, 
    startEdit, 
    cancelEdit, 
    saveEdit, 
    deleteClient, 
    createClient, 
    setFormState 
  } = useClientManager()

  const { register, handleSubmit, reset, formState: rhfState } = useForm<CreateForm>()

  useEffect(() => {
    fetchClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onCreate(data: CreateForm) {
    const success = await createClient(data)
    if (success) {
      reset()
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavClient />
      
      <div className="p-6">

      <header className="mb-6">
        <Breadcrumbs 
          items={[
            { label: "Dashboard", href: "/", icon: <HomeIcon className="h-3 w-3" /> },
            { label: "Clients", icon: <UserIcon className="h-3 w-3" /> }
          ]}
          className="mb-4"
        />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-foreground">Client Manager</h1>
            <p className="text-sm text-muted-foreground">View and edit clients</p>
          </div>
            <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusIcon className="mr-1" />
                    Add Client
                  </Button>
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
                      <p className="text-xs text-muted-foreground mt-1">If provided, this will be set as the client&apos;s initial password.</p>
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
          <CardDescription className="text-muted-foreground">Click on any client row to view full details. Edit client name and contact email inline. Data comes from Supabase.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div />
            <div>
              <Button size="sm" onClick={() => fetchClients()} disabled={loading}>Refresh</Button>
            </div>
          </div>
          {loading ? (
            <TableSkeleton 
              rows={5} 
              columns={[
                { key: 'name', label: 'Name', skeletonWidth: 'w-32' },
                { key: 'email', label: 'Contact Email', skeletonWidth: 'w-48' },
                { key: 'suppliers', label: 'Total Suppliers', skeletonWidth: 'w-24' },
                { key: 'created', label: 'Created', skeletonWidth: 'w-24' },
              ]} 
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Contact Email</TableHead>
                  <TableHead className="text-muted-foreground">Total Suppliers</TableHead>
                  <TableHead className="text-muted-foreground">Created</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow 
                    key={c.id} 
                    className={editingId !== c.id ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={editingId !== c.id ? () => window.location.href = `/admin/client-manager/${c.id}` : undefined}
                  >
                    <TableCell>
                      {editingId === c.id ? (
                        <Input value={formState.name} onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))} />
                      ) : (
                        <span className="text-foreground font-medium">{c.name}</span>
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
                      <span className="text-muted-foreground">
                        {c.supplier_count || 0}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-muted-foreground">{c.created_at ? new Date(c.created_at).toISOString().slice(0, 10) : "-"}</span>
                    </TableCell>

                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {editingId === c.id ? (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" onClick={() => saveEdit(c.id)} disabled={loading}>Save</Button>
                          <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancel</Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Button 
                            className="w-10 h-10 flex items-center justify-center bg-transparent shadow-none hover:bg-gray-100 text-gray-800" 
                            size="sm" 
                            onClick={() => startEdit(c)}
                            >
                            <PencilIcon className="mr-1" />
                          </Button>
                          <Button className="w-10 h-10 flex items-center justify-center bg-transparent shadow-none hover:bg-gray-100 text-red-500" size="sm" onClick={() => deleteClient(c.id)}>
                            <TrashIcon className="mr-1" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

  {/* old inline modal removed - using Dialog component above */}
      </div>
    </div>
  )
}
