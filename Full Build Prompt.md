Build a full-stack personal expense & budget tracker web app called "MoneyTrail"
using Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase (Postgres + Auth).

## Core Concept

Most expense trackers fail because manual entry is tedious. This app must prioritize
speed of logging a transaction (under 5 seconds) and clear, digestible spending insights.

## Tech Stack

- Next.js 14 (App Router, Server Components where possible)
- TypeScript
- Tailwind CSS for styling
- Supabase for Postgres DB + Auth (email/password + Google OAuth)
- Recharts for data visualization
- shadcn/ui for UI primitives (buttons, dialogs, inputs, cards)
- Zod for form validation
- Deploy target: Vercel

## Database Schema (Supabase/Postgres)

1. `users` table (handled by Supabase Auth)
2. `categories` table:
   - id, user_id, name, icon, color, is_default (boolean)
   - Seed default categories: Food, Transport, Shopping, Bills, Entertainment,
     Health, Rent, Subscriptions, Other
3. `transactions` table:
   - id, user_id, category_id, amount, type (income/expense), note, date, created_at
4. `budgets` table:
   - id, user_id, category_id, monthly_limit, month, year
5. `recurring_transactions` table (for subscription detection):
   - id, user_id, merchant_name, amount, frequency, last_seen_date

## Features to Build (in this order)

### 1. Auth

- Sign up / login page with email+password and Google OAuth via Supabase Auth
- Protected routes using middleware — redirect to /login if unauthenticated

### 2. Quick-Add Transaction (core UX priority)

- Floating action button (FAB) on every screen opens a modal
- Fields: amount (numeric keypad style input), category (icon grid, single tap),
  date (defaults to today), optional note
- Must be completable in under 3 taps for a typical expense
- Auto-categorization: when user types a note, match keywords against a
  predefined merchant->category dictionary (e.g., "zomato", "swiggy" -> Food;
  "uber", "ola" -> Transport) and pre-select that category

### 3. Dashboard (home screen)

- Current month total spend (large number, prominent)
- Category breakdown as a donut/pie chart (Recharts) with percentages
- Spend trend line chart (last 6 months)
- List of recent transactions (last 10, with edit/delete swipe or button)
- Budget progress bars per category (green/yellow/red based on % used)

### 4. Budgets Page

- Set/edit monthly limit per category
- Visual progress bar for each budgeted category
- Alert/badge when a category exceeds 90% of its budget

### 5. Transactions List Page

- Full paginated/infinite-scroll list of all transactions
- Filter by category, date range, type (income/expense)
- Search by note text
- Edit and delete actions

### 6. Recurring Detection (basic version)

- Simple algorithm: if the same merchant name + similar amount appears
  2+ months in a row, flag it as "Recurring" and show in a dedicated section
- No need for ML — pattern match on note/merchant field + amount tolerance (±5%)

### 7. Insights Page (basic AI-lite version, no external AI API needed for v1)

- Rule-based insights, e.g.:
  - "You spent X% more on [category] than last month"
  - "Your top spending category this month is [category]"
  - "You have [N] recurring subscriptions costing ₹X/month total"

## Design Requirements

- Mobile-first, responsive (this will primarily be used on phones)
- Clean, minimal dashboard aesthetic — reference Cred, Copilot Money,
  and Tremor.so dashboard templates for visual direction
- Dark mode support
- Use a single accent color (blue or emerald green) with neutral grays elsewhere
- Currency formatting should default to ₹ (INR) with proper thousand separators

## Non-Goals for v1 (explicitly do not build these yet)

- Bank/UPI auto-sync (requires Account Aggregator API licensing)
- Multi-user/family shared accounts
- Investment or asset tracking
- Native mobile app (this is web-only, PWA-installable is a nice-to-have)

## Deliverables

1. Full project scaffold with folder structure
2. Supabase schema as a SQL migration file
3. All pages/components listed above, fully functional
4. .env.example file listing required environment variables
5. README with setup instructions (Supabase project creation, env vars,
   running locally, deploying to Vercel)

Start by scaffolding the project structure and the Supabase schema migration file,
then build features in the order listed above. Confirm the schema with me before
writing frontend code.
