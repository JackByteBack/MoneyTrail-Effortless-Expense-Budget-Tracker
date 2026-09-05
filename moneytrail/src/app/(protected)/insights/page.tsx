import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { InsightsContent } from "@/components/dashboard/InsightsContent";

export default async function InsightsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .eq("user_id", user.id);

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("is_default", { ascending: false });

  return (
    <InsightsContent
      transactions={transactions || []}
      categories={categories || []}
    />
  );
}
