"use client";

import { Transaction, Category } from "@/types/database";
import { BarChart3, TrendingUp, TrendingDown, Lightbulb, Tag, CreditCard } from "lucide-react";

interface InsightsContentProps {
  transactions: Transaction[];
  categories: Category[];
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  upi: "UPI",
  card: "Card",
  cash: "Cash",
  net_banking: "Net Banking",
  wallet: "Wallet",
  other: "Other",
};

const PAYMENT_METHOD_ICONS: Record<string, string> = {
  upi: "📱",
  card: "💳",
  cash: "💵",
  net_banking: "🏦",
  wallet: "👛",
  other: "💰",
};

export function InsightsContent({ transactions, categories }: InsightsContentProps) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const thisMonthExpenses = transactions.filter(
    (t) =>
      t.type === "expense" &&
      new Date(t.date).getMonth() === thisMonth &&
      new Date(t.date).getFullYear() === thisYear
  );

  const lastMonthExpenses = transactions.filter(
    (t) =>
      t.type === "expense" &&
      new Date(t.date).getMonth() === lastMonth &&
      new Date(t.date).getFullYear() === lastMonthYear
  );

  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );
  const lastMonthTotal = lastMonthExpenses.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );

  const monthChange = lastMonthTotal > 0
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
    : 0;

  // Category spending
  const categorySpending: Record<string, { total: number; count: number; icon: string; name: string }> = {};
  thisMonthExpenses.forEach((t) => {
    const catId = t.category_id;
    if (!categorySpending[catId]) {
      const cat = categories.find((c) => c.id === catId);
      categorySpending[catId] = {
        total: 0,
        count: 0,
        icon: cat?.icon || "📦",
        name: cat?.name || "Unknown",
      };
    }
    categorySpending[catId].total += Number(t.amount);
    categorySpending[catId].count += 1;
  });

  const topCategories = Object.values(categorySpending)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const topCategory = topCategories[0];

  // Payment method breakdown
  const paymentMethodSpending: Record<string, { total: number; count: number }> = {};
  thisMonthExpenses.forEach((t) => {
    const method = t.payment_method || "other";
    if (!paymentMethodSpending[method]) {
      paymentMethodSpending[method] = { total: 0, count: 0 };
    }
    paymentMethodSpending[method].total += Number(t.amount);
    paymentMethodSpending[method].count += 1;
  });

  const paymentMethods = Object.entries(paymentMethodSpending)
    .map(([method, data]) => ({ method, ...data }))
    .sort((a, b) => b.total - a.total);

  // Tags analysis
  const tagSpending: Record<string, { total: number; count: number }> = {};
  thisMonthExpenses.forEach((t) => {
    if (t.tags && t.tags.length > 0) {
      t.tags.forEach((tag) => {
        if (!tagSpending[tag]) {
          tagSpending[tag] = { total: 0, count: 0 };
        }
        tagSpending[tag].total += Number(t.amount);
        tagSpending[tag].count += 1;
      });
    }
  });

  const topTags = Object.entries(tagSpending)
    .map(([tag, data]) => ({ tag, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Recurring expenses
  const recurringExpenses = thisMonthExpenses.filter((t) => t.is_recurring);
  const recurringTotal = recurringExpenses.reduce((sum, t) => sum + Number(t.amount), 0);

  // Merchant analysis
  const merchantSpending: Record<string, { total: number; count: number }> = {};
  thisMonthExpenses.forEach((t) => {
    if (t.merchant) {
      if (!merchantSpending[t.merchant]) {
        merchantSpending[t.merchant] = { total: 0, count: 0 };
      }
      merchantSpending[t.merchant].total += Number(t.amount);
      merchantSpending[t.merchant].count += 1;
    }
  });

  const topMerchants = Object.entries(merchantSpending)
    .map(([merchant, data]) => ({ merchant, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const avgPerTransaction =
    thisMonthExpenses.length > 0
      ? thisMonthTotal / thisMonthExpenses.length
      : 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const getInsight = () => {
    if (thisMonthExpenses.length === 0) {
      return {
        icon: <Lightbulb className="w-4 h-4" />,
        text: "Start tracking your expenses to get personalized insights!",
      };
    }

    if (monthChange > 20) {
      return {
        icon: <TrendingUp className="w-4 h-4 text-error" />,
        text: `You spent ${Math.abs(monthChange).toFixed(0)}% more than last month. Consider reviewing your ${topCategory?.name || "top category"} spending.`,
      };
    }

    if (monthChange < -20) {
      return {
        icon: <TrendingDown className="w-4 h-4 text-link" />,
        text: `Great job! You spent ${Math.abs(monthChange).toFixed(0)}% less than last month. Keep it up!`,
      };
    }

    return {
      icon: <BarChart3 className="w-4 h-4 text-body" />,
      text: `Your spending is consistent with last month. ${topCategory ? `Top category: ${topCategory.name} (${formatCurrency(topCategory.total)})` : ""}`,
    };
  };

  const insight = getInsight();

  return (
    <div className="space-y-4 py-6">
      {/* Month-over-Month */}
      <div className="bg-canvas-elevated rounded-lg border border-hairline p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-mute" />
          <h2 className="font-display font-semibold text-body-md text-ink">Month Overview</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-body-sm text-mute mb-0.5">This Month</p>
            <p className="font-display font-semibold text-heading-lg text-ink">
              {formatCurrency(thisMonthTotal)}
            </p>
          </div>
          <div>
            <p className="text-body-sm text-mute mb-0.5">Last Month</p>
            <p className="font-display font-semibold text-heading-lg text-body">
              {formatCurrency(lastMonthTotal)}
            </p>
          </div>
        </div>

        {lastMonthTotal > 0 && (
          <div className="mt-4 pt-4 border-t border-hairline">
            <p className="text-body-md text-body">
              {monthChange > 0 ? (
                <span className="text-error">
                  +{monthChange.toFixed(1)}% from last month
                </span>
              ) : monthChange < 0 ? (
                <span className="text-link">
                  {monthChange.toFixed(1)}% from last month
                </span>
              ) : (
                <span>Same as last month</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <div className="bg-canvas-elevated rounded-lg border border-hairline p-5">
          <h2 className="font-display font-semibold text-body-md text-ink mb-4">
            Top Spending Categories
          </h2>

          <div className="space-y-3">
            {topCategories.map((cat, index) => {
              const percent = (cat.total / thisMonthTotal) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-body-md text-body">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-body-md font-medium text-ink">
                        {formatCurrency(cat.total)}
                      </span>
                      <span className="text-body-sm text-mute ml-2">
                        {cat.count} txn{cat.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-hairline-soft rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ink rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Method Breakdown */}
      {paymentMethods.length > 0 && (
        <div className="bg-canvas-elevated rounded-lg border border-hairline p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-mute" />
            <h2 className="font-display font-semibold text-body-md text-ink">Payment Methods</h2>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((pm, index) => {
              const percent = (pm.total / thisMonthTotal) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{PAYMENT_METHOD_ICONS[pm.method] || "💰"}</span>
                      <span className="text-body-md text-body">{PAYMENT_METHOD_LABELS[pm.method] || pm.method}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-body-md font-medium text-ink">
                        {formatCurrency(pm.total)}
                      </span>
                      <span className="text-body-sm text-mute ml-2">
                        {pm.count} txn{pm.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-hairline-soft rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ink rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tags Cloud */}
      {topTags.length > 0 && (
        <div className="bg-canvas-elevated rounded-lg border border-hairline p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-mute" />
            <h2 className="font-display font-semibold text-body-md text-ink">Tags</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {topTags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-link/10 text-link rounded-full"
              >
                <span className="text-body-sm font-medium">{tag.tag}</span>
                <span className="text-xs text-link/70">{tag.count}x</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-hairline">
            <p className="text-body-sm text-mute">
              {topTags.length} unique tags across {topTags.reduce((sum, t) => sum + t.count, 0)} transactions
            </p>
          </div>
        </div>
      )}

      {/* Recurring Expenses */}
      {recurringExpenses.length > 0 && (
        <div className="bg-canvas-elevated rounded-lg border border-hairline p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔄</span>
            <h2 className="font-display font-semibold text-body-md text-ink">Recurring Expenses</h2>
          </div>

          <div className="mb-4">
            <p className="text-body-sm text-mute">Total this month</p>
            <p className="font-display font-semibold text-heading-md text-ink">
              {formatCurrency(recurringTotal)}
            </p>
          </div>

          <div className="space-y-2">
            {recurringExpenses.slice(0, 5).map((t, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🔄</span>
                  <span className="text-body-sm text-body">{t.merchant || t.category?.name || "Recurring"}</span>
                </div>
                <span className="text-body-sm font-medium text-ink">{formatCurrency(Number(t.amount))}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Merchants */}
      {topMerchants.length > 0 && (
        <div className="bg-canvas-elevated rounded-lg border border-hairline p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏪</span>
            <h2 className="font-display font-semibold text-body-md text-ink">Top Merchants</h2>
          </div>

          <div className="space-y-3">
            {topMerchants.map((m, index) => {
              const percent = (m.total / thisMonthTotal) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-body-md text-body">{m.merchant}</span>
                    <div className="text-right">
                      <span className="text-body-md font-medium text-ink">
                        {formatCurrency(m.total)}
                      </span>
                      <span className="text-body-sm text-mute ml-2">
                        {m.count}x
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-hairline-soft rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ink rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Insight */}
      <div className="bg-canvas-elevated rounded-lg border border-hairline p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-hairline-soft flex items-center justify-center flex-shrink-0">
            {insight.icon}
          </div>
          <div>
            <p className="text-body-md text-body leading-relaxed">{insight.text}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-canvas-elevated rounded-lg border border-hairline p-5">
        <h2 className="font-display font-semibold text-body-md text-ink mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-body-sm text-mute">Total Transactions</p>
            <p className="font-display font-semibold text-heading-md text-ink">
              {thisMonthExpenses.length}
            </p>
          </div>
          <div>
            <p className="text-body-sm text-mute">Avg per Transaction</p>
            <p className="font-display font-semibold text-heading-md text-ink">
              {formatCurrency(avgPerTransaction)}
            </p>
          </div>
          <div>
            <p className="text-body-sm text-mute">Unique Merchants</p>
            <p className="font-display font-semibold text-heading-md text-ink">
              {Object.keys(merchantSpending).length}
            </p>
          </div>
          <div>
            <p className="text-body-sm text-mute">Active Tags</p>
            <p className="font-display font-semibold text-heading-md text-ink">
              {Object.keys(tagSpending).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
