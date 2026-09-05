"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types/database";
import { X, Check } from "lucide-react";

const CATEGORIES = [
  { name: "Food", icon: "🍔", color: "#FF6B6B" },
  { name: "Transport", icon: "🚗", color: "#4ECDC4" },
  { name: "Shopping", icon: "🛍️", color: "#FFE66D" },
  { name: "Bills", icon: "📄", color: "#95E1D3" },
  { name: "Entertainment", icon: "🎬", color: "#F38181" },
  { name: "Health", icon: "💊", color: "#AA96DA" },
  { name: "Rent", icon: "🏠", color: "#FCBAD3" },
  { name: "Subscriptions", icon: "📱", color: "#A8D8EA" },
  { name: "Other", icon: "📦", color: "#C4C4C4" },
];

const AUTO_CATEGORIZE: Record<string, string> = {
  zomato: "Food",
  swiggy: "Food",
  dominos: "Food",
  mcdonalds: "Food",
  uber: "Transport",
  ola: "Transport",
  rapido: "Transport",
  metro: "Transport",
  amazon: "Shopping",
  flipkart: "Shopping",
  meesho: "Shopping",
  electricity: "Bills",
  water: "Bills",
  gas: "Bills",
  internet: "Bills",
  jio: "Bills",
  airtel: "Bills",
  vi: "Bills",
  netflix: "Subscriptions",
  spotify: "Subscriptions",
  prime: "Subscriptions",
  hotstar: "Subscriptions",
  rent: "Rent",
  house: "Rent",
};

export function QuickAddModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("is_default", { ascending: false });

      if (data) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, [supabase]);

  const handleNoteChange = (value: string) => {
    setNote(value);

    if (!selectedCategory && value.length >= 3) {
      const lower = value.toLowerCase();
      for (const [keyword, categoryName] of Object.entries(AUTO_CATEGORIZE)) {
        if (lower.includes(keyword)) {
          const match = categories.find((c) => c.name === categoryName);
          if (match) {
            setSelectedCategory(match.id);
          }
          break;
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!amount || !selectedCategory) return;

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      category_id: selectedCategory,
      amount: parseFloat(amount),
      type,
      note: note || null,
      date,
    });

    if (!error) {
      onClose();
      window.location.reload();
    }

    setLoading(false);
  };

  const displayCategories = categories.length > 0
    ? categories
    : CATEGORIES.map((c, i) => ({ ...c, id: `default-${i}`, user_id: null, is_default: true, created_at: "" }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-canvas-elevated border border-hairline rounded-lg w-full max-w-md p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-heading-md text-ink">Add Transaction</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-hairline-soft transition-colors"
          >
            <X className="w-5 h-5 text-mute" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-1 p-1 bg-hairline-soft rounded-lg mb-6">
          <button
            onClick={() => setType("expense")}
            className={`flex-1 py-1.5 rounded-md text-body-md font-medium transition-colors ${
              type === "expense"
                ? "bg-canvas-elevated text-ink shadow-sm"
                : "text-mute hover:text-body"
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setType("income")}
            className={`flex-1 py-1.5 rounded-md text-body-md font-medium transition-colors ${
              type === "income"
                ? "bg-canvas-elevated text-ink shadow-sm"
                : "text-mute hover:text-body"
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-body-sm font-medium text-body mb-1.5">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body-lg text-mute">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-canvas-elevated border border-hairline rounded-md text-heading-lg text-ink placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Category Grid */}
        <div className="mb-6">
          <label className="block text-body-sm font-medium text-body mb-1.5">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {displayCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
                  selectedCategory === cat.id
                    ? "bg-ink text-on-primary border-ink"
                    : "bg-canvas-elevated border-hairline hover:border-faint"
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-body-sm font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="block text-body-sm font-medium text-body mb-1.5">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => handleNoteChange(e.target.value)}
            className="w-full px-3 py-2 bg-canvas-elevated border border-hairline rounded-md text-body-md text-ink placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink"
            placeholder="e.g., Lunch at Zomato"
          />
        </div>

        {/* Date */}
        <div className="mb-6">
          <label className="block text-body-sm font-medium text-body mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-canvas-elevated border border-hairline rounded-md text-body-md text-ink focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!amount || !selectedCategory || loading}
          className="w-full py-2 px-4 bg-ink text-on-primary font-button-lg rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Check className="w-4 h-4" />
              Add Transaction
            </>
          )}
        </button>
      </div>
    </div>
  );
}
