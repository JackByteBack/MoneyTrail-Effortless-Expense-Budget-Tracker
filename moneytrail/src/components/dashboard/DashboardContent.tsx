"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Transaction, Budget } from "@/types/database";
import { ArrowUpRight, ArrowDownRight, TrendingUp, PiggyBank, Plus } from "lucide-react";

interface DashboardContentProps {
  totalSpend: number;
  totalIncome: number;
  categoryBreakdown: { name: string; value: number; color: string; icon: string }[];
  monthlyTrend: { month: string; total: number }[];
  recentTransactions: Transaction[];
  budgets: Budget[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DashboardContent({
  totalSpend,
  totalIncome,
  categoryBreakdown,
  monthlyTrend,
  recentTransactions,
  budgets,
}: DashboardContentProps) {
  return (
    <div className="space-y-4 py-4 sm:py-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-canvas-elevated rounded-xl p-4 border border-hairline">
          <div className="flex items-center gap-1.5 text-muted text-caption mb-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            Total Spent
          </div>
          <div className="font-display text-display-sm sm:text-display-md text-ink">
            {formatCurrency(totalSpend)}
          </div>
        </div>

        <div className="bg-canvas-elevated rounded-xl p-4 border border-hairline">
          <div className="flex items-center gap-1.5 text-muted text-caption mb-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Total Income
          </div>
          <div className="font-display text-display-sm sm:text-display-md text-positive">
            {formatCurrency(totalIncome)}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-canvas-elevated rounded-xl p-4 sm:p-5 border border-hairline">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-muted" />
          <h2 className="font-display text-body-md-strong text-ink">Spending by Category</h2>
        </div>

        {categoryBreakdown.length > 0 ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--color-hairline)",
                      backgroundColor: "rgb(var(--color-canvas-elevated))",
                      color: "rgb(var(--color-ink))",
                      fontSize: "14px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 w-full space-y-2">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-body-sm text-ink">
                      {cat.icon} {cat.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm-strong text-ink">
                      {formatCurrency(cat.value)}
                    </span>
                    {totalSpend > 0 && (
                      <span className="text-caption text-muted w-10 text-right">
                        {((cat.value / totalSpend) * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 bg-canvas-soft rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted" />
            </div>
            <p className="text-body-sm text-muted">
              No expenses this month yet
            </p>
            <p className="text-caption text-muted mt-1">
              Tap the + button to add your first expense
            </p>
          </div>
        )}
      </div>

      {/* Monthly Trend */}
      <div className="bg-canvas-elevated rounded-xl p-4 sm:p-5 border border-hairline">
        <h2 className="font-display text-body-md-strong text-ink mb-4">6-Month Trend</h2>
        <div className="h-40 sm:h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#868685", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#868685", fontSize: 12 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                width={45}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--color-hairline)",
                  backgroundColor: "rgb(var(--color-canvas-elevated))",
                  color: "rgb(var(--color-ink))",
                  fontSize: "14px",
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#9fe870"
                strokeWidth={2.5}
                dot={{ fill: "#9fe870", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "#9fe870" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Progress */}
      {budgets.length > 0 && (
        <div className="bg-canvas-elevated rounded-xl p-4 sm:p-5 border border-hairline">
          <div className="flex items-center gap-2 mb-4">
            <PiggyBank className="w-4 h-4 text-muted" />
            <h2 className="font-display text-body-md-strong text-ink">Budget Progress</h2>
          </div>

          <div className="space-y-4">
            {budgets.map((budget) => {
              const cat = budget.category as { icon?: string; name?: string } | null;
              const spent =
                categoryBreakdown.find((c) => c.name === cat?.name)?.value || 0;
              const limit = Number(budget.monthly_limit);
              const percent = Math.min((spent / limit) * 100, 100);
              const color =
                percent >= 90 ? "#d03238" : percent >= 70 ? "#ffd11a" : "#9fe870";

              return (
                <div key={budget.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-body-sm text-ink">
                      {cat?.icon} {cat?.name}
                    </span>
                    <span className="text-caption text-muted">
                      {formatCurrency(spent)} / {formatCurrency(limit)}
                    </span>
                  </div>
                  <div className="h-2 bg-canvas-soft rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-canvas-elevated rounded-xl p-4 sm:p-5 border border-hairline">
        <h2 className="font-display text-body-md-strong text-ink mb-4">Recent Transactions</h2>

        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-canvas-soft">
            {recentTransactions.slice(0, 5).map((t) => {
              const cat = t.category as { icon?: string; name?: string } | null;
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cat?.icon || "📦"}</span>
                    <div>
                      <p className="text-body-sm-strong text-ink">
                        {cat?.name || "Unknown"}
                      </p>
                      {t.note && (
                        <p className="text-caption text-muted line-clamp-1">{t.note}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-body-sm-strong ${
                        t.type === "expense" ? "text-negative" : "text-positive"
                      }`}
                    >
                      {t.type === "expense" ? "-" : "+"}
                      {formatCurrency(Number(t.amount))}
                    </p>
                    <p className="text-caption text-muted">
                      {new Date(t.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 bg-canvas-soft rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted" />
            </div>
            <p className="text-body-sm text-muted">
              No transactions yet
            </p>
            <p className="text-caption text-muted mt-1">
              Tap the + button to add one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
