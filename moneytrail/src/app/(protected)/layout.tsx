import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/ui/Navbar";
import { FABWithModal } from "@/components/transactions/FABWithModal";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar user={user} />
      <main className="pt-14 pb-20 md:pb-8 px-4 max-w-4xl mx-auto">
        {children}
      </main>
      <FABWithModal />
    </div>
  );
}
