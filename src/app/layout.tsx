import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { getUserRoleFromSession } from "@/lib/supabase/getUserRole";
import RoleBanner from "@/components/ui/RoleBanner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SyNtis Risk Management Dashboard",
  description: "",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server component: fetch the user's role and render banner server-side
  const role = await getUserRoleFromSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        
        {/* Client-side banner component. Server passes role string */}
        <RoleBanner role={role?.role ?? null} />

        <div className="p-6">
          {children}
        </div>

        
      </body>
    </html>
  );
}
