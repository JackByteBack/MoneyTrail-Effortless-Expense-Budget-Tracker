export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  icon: string;
  color: string;
  is_default: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  type: "income" | "expense";
  note: string | null;
  date: string;
  created_at: string;
  category?: Category | null;
  payment_method?: string | null;
  merchant?: string | null;
  tags?: string[] | null;
  receipt_url?: string | null;
  is_recurring?: boolean | null;
  recurring_frequency?: "weekly" | "monthly" | "yearly" | null;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  monthly_limit: number;
  month: number;
  year: number;
  created_at: string;
  category?: Category | null;
}

export interface RecurringTransaction {
  id: string;
  user_id: string;
  merchant_name: string;
  amount: number;
  frequency: "weekly" | "monthly" | "yearly";
  last_seen_date: string;
  created_at: string;
}
