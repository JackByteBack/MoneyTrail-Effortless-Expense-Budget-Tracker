I have initialized a new Next.js project. Use Tailwind CSS for styling and
follow @DESIGN.md strictly for all visual design decisions (colors, typography,
spacing, components).

## Project

Name: MoneyTrail
Domain: moneytrail.app (or moneytrail.in)
Tagline: "Know where your money actually goes."

## Core Problem

People don't lack transaction data — banks and UPI apps already show it. What
they lack is categorized, digestible insight into where money actually goes
each month. Most expense trackers fail because manual entry is tedious, and
users abandon them within a week.

## Core Differentiator

Make tracking near-zero-effort (fast-add UI, smart auto-categorization) and
make the resulting insights genuinely useful — not just a raw transaction list.

## Competitor

Our competitor is [INSERT COMPETITOR — e.g., Walnut, Money View, YNAB]. Review
the site/app and identify what it does well and where it falls short, then
design our feature set to beat it. Do not copy its visual design or UI — our
visual identity comes entirely from @DESIGN.md.

## MVP Scope (v1 — ship in 3-4 weeks)

Must-have features:

1. Auth — email/password + Google login
2. Manual transaction entry — amount, category, date, optional note. Must be
   a fast-add UI (under 5 seconds to log an expense), not a form-heavy flow
3. Auto-categorization — rule-based keyword matching first (e.g., "Zomato",
   "Swiggy" -> Food; "Uber", "Ola" -> Transport), AI-based upgrade deferred
   to v2
4. Dashboard — current month total spend, category breakdown (pie/bar chart),
   6-month spend trend line
5. Budget limits — set a monthly cap per category, visual progress bar with
   warning state near/over budget
6. Recurring expense detection — flag subscriptions/rent by matching repeated
   merchant name + similar amount across 2+ months

Explicitly cut from v1 (resist scope creep):

- Bank/UPI auto-sync (requires Account Aggregator licensing — v2)
- Multi-user/family shared accounts
- Investment or asset tracking

## Database Schema (Postgres via Supabase)

1. users — handled by Supabase Auth
2. categories — id, user_id, name, icon, color, is_default
   (seed defaults: Food, Transport, Shopping, Bills, Entertainment, Health,
   Rent, Subscriptions, Other)
3. transactions — id, user_id, category_id, amount, type (income/expense),
   note, date, created_at
4. budgets — id, user_id, category_id, monthly_limit, month, year
5. recurring_transactions — id, user_id, merchant_name, amount, frequency,
   last_seen_date

## Tech Stack

- Frontend: Next.js (App Router) + Tailwind CSS
- Charts: Recharts
- Backend: Next.js API routes
- DB + Auth: Supabase (Postgres + Auth)
- Hosting: Vercel

## Monetization (freemium — not built in v1, but design schema to support it)

- Free: manual tracking, basic categorization, 1 budget limit
- Premium (₹99–199/mo): Bank/UPI auto-sync, AI-powered insights, unlimited
  budgets + custom categories, PDF/CSV export

## Deliverables for this session

1. Confirm @DESIGN.md tokens (colors, fonts, spacing) are understood and
   wired into Tailwind config
2. Propose Next.js project structure and routing
3. Supabase schema as a SQL migration file
4. Build in this order: Auth + DB → Quick-add transaction UI → Dashboard
   - charts → Budgets + recurring detection

Start by confirming @DESIGN.md tokens, then propose the project structure
and the Supabase schema before writing component code.
