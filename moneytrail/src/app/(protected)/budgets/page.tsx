import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BudgetsContent } from "@/components/dashboard/BudgetsContent";

export default async function BudgetsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: budgets } = await supabase
    .from("budgets")
    .select("*, category:categories(*)")
    .eq("user_id", user.id);

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("is_default", { ascending: false });

  return (
    <BudgetsContent
      budgets={budgets || []}
      categories={categories || []}
    />
  );
}
