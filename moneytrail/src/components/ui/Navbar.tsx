"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useTheme } from "./ThemeProvider";
import {
  LayoutDashboard,
  ArrowUpDown,
  PiggyBank,
  Lightbulb,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowUpDown },
  { href: "/budgets", label: "Budgets", icon: PiggyBank },
  { href: "/insights", label: "Insights", icon: Lightbulb },
];

export function Navbar({ user }: { user: User }) { // eslint-disable-line @typescript-eslint/no-unused-vars
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggle } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-canvas/80 backdrop-blur-md z-50 border-b border-ink/5">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-display text-display-xs text-ink tracking-tight">
            MoneyTrail
          </Link>

          <div className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-body-sm transition-all ${
                    isActive
                      ? "bg-primary text-on-primary font-body-sm-strong"
                      : "text-muted hover:text-ink hover:bg-canvas-soft"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}

            <div className="w-px h-4 bg-ink/10 mx-1" />

            <button
              onClick={toggle}
              className="p-2 rounded-pill text-muted hover:text-ink hover:bg-hairline-soft transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-body-sm text-muted hover:text-negative hover:bg-negative-bg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-canvas/95 backdrop-blur-md z-50 border-t border-hairline safe-area-bottom">
        <div className="flex items-center justify-around h-14 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-[60px] ${
                  isActive
                    ? "text-ink"
                    : "text-mute"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={toggle}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-mute min-w-[60px]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="text-[10px] font-medium">Theme</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-mute min-w-[60px]"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}
