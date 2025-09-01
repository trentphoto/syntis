import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";

interface AdminNavProps {
  className?: string;
}

export default function AdminNav({ className = "" }: AdminNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/admin/client-manager", label: "Clients" },
    { href: "/admin/supplier-manager", label: "Suppliers" },
    { href: "/admin/risk-factors-manager", label: "Risk Factors" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/audit", label: "Audit" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <header className={`border-b border-border bg-card ${className}`}>
      <div className="flex h-14 items-center justify-between px-6">
        <nav className="flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <Button 
                key={item.href}
                variant="ghost" 
                size="sm" 
                asChild
                className={`${
                  isActive 
                    ? "text-foreground bg-accent" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Link href={item.href}>
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
