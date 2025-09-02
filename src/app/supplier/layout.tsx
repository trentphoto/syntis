"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { BuildingIcon, ShieldIcon, SettingsIcon, HomeIcon } from "lucide-react";

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const navigation = [
    { name: "Dashboard", href: "/supplier/dashboard", icon: HomeIcon },
    { name: "Security", href: "/supplier/security", icon: ShieldIcon },
    { name: "Settings", href: "/supplier/settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
        <div className="w-full px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <BuildingIcon className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Supplier Portal</span>
              </div>
              
              <div className="hidden md:flex space-x-1">
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    onClick={() => router.push(item.href)}
                    className="flex items-center space-x-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
        <div className="w-full px-6">
          <div className="flex space-x-1 py-2">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                size="sm"
                onClick={() => router.push(item.href)}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs">{item.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <main className="w-full px-6 py-8">
        {children}
      </main>
    </div>
  );
}
