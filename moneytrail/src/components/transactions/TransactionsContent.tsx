"use client";

import { useState } from "react";
import { Transaction, Category } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Search, Filter, X, CreditCard, Wallet, Building2, Smartphone, Receipt, ArrowRightLeft } from "lucide-react";

interface TransactionsContentProps {
  transactions: (Transaction & { category: Category | null })[];
  categories: Category[];
}

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "cash", label: "Cash", icon: Wallet },
  { id: "net_banking", label: "Net Banking", icon: Building2 },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "other", label: "Other", icon: ArrowRightLeft },
];

const PAYMENT_METHOD_ICONS: Record<string, string> = {
  upi: "📱",
  card: "💳",
  cash: "💵",
  net_banking: "🏦",
  wallet: "👛",
  other: "💰",
};

export function TransactionsContent({ transactions, categories }: TransactionsContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"expense" | "income" | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.merchant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || t.category_id === selectedCategory;
    const matchesType = !selectedType || t.type === selectedType;
    const matchesPaymentMethod = !selectedPaymentMethod || t.payment_method === selectedPaymentMethod;

    return matchesSearch && matchesCategory && matchesType && matchesPaymentMethod;
  });

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from("transactions").delete().eq("id", id);
    window.location.reload();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const hasFilters = searchQuery || selectedCategory || selectedType || selectedPaymentMethod;

  return (
    <div className="space-y-4 py-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mute" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-canvas-elevated border border-hairline rounded-lg text-body-md text-ink placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink"
        />
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button
          onClick={() => setSelectedType(selectedType === "expense" ? null : "expense")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors border ${
            selectedType === "expense"
              ? "bg-ink text-on-primary border-ink"
              : "bg-canvas-elevated border-hairline text-body hover:border-faint"
          }`}
        >
          <Filter className="w-3 h-3" />
          Expenses
        </button>
        <button
          onClick={() => setSelectedType(selectedType === "income" ? null : "income")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors border ${
            selectedType === "income"
              ? "bg-ink text-on-primary border-ink"
              : "bg-canvas-elevated border-hairline text-body hover:border-faint"
          }`}
        >
          <Filter className="w-3 h-3" />
          Income
        </button>

        <div className="w-px bg-hairline" />

        {categories.slice(0, 4).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors border ${
              selectedCategory === cat.id
                ? "bg-ink text-on-primary border-ink"
                : "bg-canvas-elevated border-hairline text-body hover:border-faint"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Payment Method Filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedPaymentMethod(selectedPaymentMethod === method.id ? null : method.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors border ${
              selectedPaymentMethod === method.id
                ? "bg-ink text-on-primary border-ink"
                : "bg-canvas-elevated border-hairline text-body hover:border-faint"
            }`}
          >
            <span className="text-sm">{PAYMENT_METHOD_ICONS[method.id]}</span>
            {method.label}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button
          onClick={() => {
            setSearchQuery("");
            setSelectedCategory(null);
            setSelectedType(null);
            setSelectedPaymentMethod(null);
          }}
          className="flex items-center gap-1 text-body-sm text-mute hover:text-body"
        >
          <X className="w-3 h-3" />
          Clear filters
        </button>
      )}

      {/* Transaction List */}
      <div className="bg-canvas-elevated rounded-lg border border-hairline divide-y divide-hairline">
        {filtered.length > 0 ? (
          filtered.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl">{t.category?.icon || "📦"}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-body-md font-medium text-ink truncate">
                      {t.category?.name || "Unknown"}
                    </p>
                    {t.merchant && (
                      <span className="text-body-sm text-mute truncate">· {t.merchant}</span>
                    )}
                  </div>
                  {t.note && (
                    <p className="text-body-sm text-mute line-clamp-1">{t.note}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {t.payment_method && (
                      <span className="inline-flex items-center gap-1 text-xs text-mute bg-hairline-soft px-1.5 py-0.5 rounded">
                        {PAYMENT_METHOD_ICONS[t.payment_method] || "💰"} {t.payment_method}
                      </span>
                    )}
                    {t.tags && t.tags.length > 0 && (
                      <div className="flex gap-1">
                        {t.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-xs text-link bg-link/10 px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                        {t.tags.length > 2 && (
                          <span className="text-xs text-mute">+{t.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                    {t.is_recurring && (
                      <span className="text-xs text-warning bg-warning/10 px-1.5 py-0.5 rounded">
                        🔄 {t.recurring_frequency || "recurring"}
                      </span>
                    )}
                    {t.receipt_url && (
                      <Receipt className="w-3 h-3 text-mute" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p
                    className={`text-body-md font-medium ${
                      t.type === "expense" ? "text-error" : "text-link"
                    }`}
                  >
                    {t.type === "expense" ? "-" : "+"}
                    {formatCurrency(Number(t.amount))}
                  </p>
                  <p className="text-body-sm text-mute">
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deleting === t.id}
                  className="p-1.5 rounded-md text-mute hover:text-error hover:bg-negative-bg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-body-md text-body">No transactions found</p>
            <p className="text-body-sm text-mute mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
