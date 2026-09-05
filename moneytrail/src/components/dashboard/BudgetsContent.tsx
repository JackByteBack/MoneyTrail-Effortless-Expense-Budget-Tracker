"use client";

import { useState } from "react";
import { Budget, Category } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface BudgetsContentProps {
  budgets: (Budget & { category: Category | null })[];
  categories: Category[];
}

export function BudgetsContent({ budgets, categories }: BudgetsContentProps) {
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!selectedCategory || !limit) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingBudget) {
      await supabase
        .from("budgets")
        .update({ monthly_limit: parseFloat(limit) })
        .eq("id", editingBudget);
    } else {
      await supabase.from("budgets").insert({
        user_id: user.id,
        category_id: selectedCategory,
        monthly_limit: parseFloat(limit),
      });
    }

    setShowAddForm(false);
    setEditingBudget(null);
    setSelectedCategory(null);
    setLimit("");
    setLoading(false);
    window.location.reload();
  };

  const handleEdit = (budget: Budget & { category: Category | null }) => {
    setEditingBudget(budget.id);
    setSelectedCategory(budget.category_id);
    setLimit(String(budget.monthly_limit));
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("budgets").delete().eq("id", id);
    window.location.reload();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const unusedCategories = categories.filter(
    (cat) => !budgets.some((b) => b.category_id === cat.id)
  );

  return (
    <div className="space-y-4 py-6">
      {/* Budget Cards */}
      <div className="space-y-3">
        {budgets.map((budget) => {
          const cat = budget.category;
          const spent = 0;
          const limit = Number(budget.monthly_limit);
          const percent = Math.min((spent / limit) * 100, 100);
          const color = percent >= 90 ? "#ee0000" : percent >= 70 ? "#f5a623" : "#171717";

          return (
            <div
              key={budget.id}
              className="bg-canvas-elevated rounded-lg border border-hairline p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat?.icon || "📦"}</span>
                  <div>
                    <p className="text-body-md font-medium text-ink">
                      {cat?.name || "Unknown"}
                    </p>
                    <p className="text-body-sm text-mute">
                      {formatCurrency(spent)} spent of {formatCurrency(limit)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="p-1.5 rounded-md text-mute hover:text-body hover:bg-hairline-soft transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="p-1.5 rounded-md text-mute hover:text-error hover:bg-negative-bg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-hairline-soft rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percent}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}

        {budgets.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-3 bg-canvas rounded-full border border-hairline flex items-center justify-center">
              <Plus className="w-6 h-6 text-mute" />
            </div>
            <p className="text-body-md text-body">No budgets set</p>
            <p className="text-body-sm text-mute mt-1">
              Create a budget to start tracking your spending limits
            </p>
          </div>
        )}
      </div>

      {/* Add Budget Form */}
      {showAddForm && (
        <div className="bg-canvas-elevated rounded-lg border border-hairline p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-body-md text-ink">
              {editingBudget ? "Edit Budget" : "Add Budget"}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingBudget(null);
                setSelectedCategory(null);
                setLimit("");
              }}
              className="p-1.5 rounded-md text-mute hover:text-body hover:bg-hairline-soft transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-body-sm font-medium text-body mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {unusedCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                      selectedCategory === cat.id
                        ? "bg-ink text-on-primary border-ink"
                        : "bg-canvas-elevated border-hairline hover:border-faint"
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-body-sm font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-body-sm font-medium text-body mb-1.5">
                Monthly Limit (₹)
              </label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full px-3 py-2 bg-canvas-elevated border border-hairline rounded-md text-body-md text-ink placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink"
                placeholder="e.g., 10000"
                min="0"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedCategory || !limit || loading}
              className="w-full py-2 px-4 bg-ink text-on-primary font-button-lg rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : editingBudget ? "Update Budget" : "Create Budget"}
            </button>
          </div>
        </div>
      )}

      {/* Add Budget Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-2 px-4 bg-canvas-elevated border border-hairline text-ink font-button-lg rounded-full hover:bg-hairline-soft transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Budget
        </button>
      )}
    </div>
  );
}
