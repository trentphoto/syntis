import MainNav from "@/components/MainNav";
import Footer from "@/components/footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        
        <MainNav />

        <div className="flex-1 flex flex-col gap-20 p-5">
          {children}
        </div>

        <Footer />
        
      </div>
    </main>
  );
}
