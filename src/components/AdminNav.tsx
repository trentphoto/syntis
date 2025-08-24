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
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/client-manager", label: "Clients" },
    { href: "/admin/risk-factors-manager", label: "Risk Factors" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/audit", label: "Audit" },
  ];

  return (
    <header className={`border-b border-border bg-card ${className}`}>
      <div className="flex h-14 items-center justify-between px-6">
        <nav className="flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href} className="inline-block">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${
                    isActive 
                      ? "text-foreground bg-accent" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
