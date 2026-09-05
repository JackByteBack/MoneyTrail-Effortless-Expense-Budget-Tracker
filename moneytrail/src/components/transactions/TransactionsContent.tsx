"use client";

import { useState } from "react";
import { Transaction, Category } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Search, Filter, X } from "lucide-react";

interface TransactionsContentProps {
  transactions: (Transaction & { category: Category | null })[];
  categories: Category[];
}

export function TransactionsContent({ transactions, categories }: TransactionsContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"expense" | "income" | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.note?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || t.category_id === selectedCategory;
    const matchesType = !selectedType || t.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
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

  const hasFilters = searchQuery || selectedCategory || selectedType;

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

      {/* Filter Pills */}
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

      {hasFilters && (
        <button
          onClick={() => {
            setSearchQuery("");
            setSelectedCategory(null);
            setSelectedType(null);
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
              <div className="flex items-center gap-3">
                <span className="text-xl">{t.category?.icon || "📦"}</span>
                <div>
                  <p className="text-body-md font-medium text-ink">
                    {t.category?.name || "Unknown"}
                  </p>
                  {t.note && (
                    <p className="text-body-sm text-mute line-clamp-1">{t.note}</p>
                  )}
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
