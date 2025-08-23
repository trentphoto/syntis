"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, DollarSign, TrendingUp, Activity, AlertCircle } from "lucide-react"

// Client data from the provided JSON (mocked here for UI)
const clientsData = [
  { id: "c1", name: "TechCorp Solutions", value: 1, created: "2025-07-20", contact_email: "hello@techcorp.com" },
  { id: "c2", name: "Acme Corp", value: 1, created: "2025-07-18", contact_email: "contact@acme.com" },
  { id: "c3", name: "Test Client4", value: 1, created: "2025-07-17", contact_email: "test4@example.com" },
  { id: "c4", name: "Blue Ocean Ltd", value: 1, created: "2025-06-09", contact_email: "info@blueocean.com" },
  { id: "c5", name: "Greenfield LLC", value: 1, created: "2025-06-07", contact_email: "team@greenfield.com" },
  { id: "c6", name: "Extra Client", value: 1, created: "2025-05-02", contact_email: "extra@example.com" },
]

// Mock data for additional charts
const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 67000 },
]

const userActivityData = [
  { day: "Mon", active: 1200 },
  { day: "Tue", active: 1100 },
  { day: "Wed", active: 1400 },
  { day: "Thu", active: 1300 },
  { day: "Fri", active: 1600 },
  { day: "Sat", active: 900 },
  { day: "Sun", active: 800 },
]

const statusData = [
  { name: "Active", value: 68, color: "#6b7280" },
  { name: "Pending", value: 22, color: "#9ca3af" },
  { name: "Inactive", value: 10, color: "#d1d5db" },
]

// Mock audit trail data
const auditLogs = [
  { id: 1, action: "User Login", user: "admin@company.com", timestamp: "2025-01-20 14:32:15", status: "Success" },
  { id: 2, action: "Client Created", user: "admin@company.com", timestamp: "2025-01-20 14:28:42", status: "Success" },
  { id: 3, action: "Settings Updated", user: "admin@company.com", timestamp: "2025-01-20 14:15:33", status: "Success" },
  { id: 4, action: "Failed Login", user: "unknown@domain.com", timestamp: "2025-01-20 13:45:21", status: "Failed" },
  { id: 5, action: "Data Export", user: "admin@company.com", timestamp: "2025-01-20 13:22:18", status: "Success" },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-14 items-center justify-between px-6">
          <h1 className="text-3xl font-medium text-foreground">Welcome, Admin</h1>
          <nav className="flex items-center space-x-6">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Clients
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Analytics
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Audit
            </Button>
          </nav>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">3</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$67,000</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">+24%</div>
              <p className="text-xs text-muted-foreground">+4% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1,234</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2</div>
              <p className="text-xs text-muted-foreground">-3 from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Full-width Clients Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Client Overview</CardTitle>
            <CardDescription className="text-muted-foreground">Current clients in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                clients: {
                  label: "Clients",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-clients)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Client Manager quick view */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Client Manager</CardTitle>
              <CardDescription className="text-muted-foreground">5 most recent clients</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/admin/client-manager">
                <Button size="sm">Go to Client Manager</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">Client</TableHead>
                  <TableHead className="text-muted-foreground">Created</TableHead>
                  <TableHead className="text-muted-foreground">Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientsData
                  .slice()
                  .sort((a, b) => (a.created < b.created ? 1 : -1))
                  .slice(0, 5)
                  .map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-foreground">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">{c.created}</TableCell>
                      <TableCell className="text-muted-foreground">{c.contact_email}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Three Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Revenue Trend</CardTitle>
              <CardDescription className="text-muted-foreground">Monthly revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">User Activity</CardTitle>
              <CardDescription className="text-muted-foreground">Daily active users</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  active: {
                    label: "Active Users",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="active" fill="var(--color-active)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Status Distribution</CardTitle>
              <CardDescription className="text-muted-foreground">Current status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  status: {
                    label: "Status",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Audit Trail Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Audit Trail</CardTitle>
            <CardDescription className="text-muted-foreground">Recent system activities and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">Action</TableHead>
                  <TableHead className="text-muted-foreground">User</TableHead>
                  <TableHead className="text-muted-foreground">Timestamp</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-foreground">{log.action}</TableCell>
                    <TableCell className="text-muted-foreground">{log.user}</TableCell>
                    <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge
                        variant={log.status === "Success" ? "secondary" : "destructive"}
                        className={log.status === "Success" ? "bg-muted text-muted-foreground" : ""}
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="flex h-12 items-center justify-center px-6">
          <p className="text-sm text-muted-foreground">© 2025 Admin Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
