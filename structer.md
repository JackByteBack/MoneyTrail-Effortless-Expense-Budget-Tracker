I'm building MoneyTrail — a personal expense & budget tracker. Set up the full
project foundation using the stack below, then scaffold the core architecture
before writing feature code. Follow @DESIGN.md (Wise reference) for all visual
decisions — colors, typography, spacing, component style.

## Tech Stack & Setup Requirements

### Frontend — Next.js 14 (App Router) + Tailwind CSS

- Use TypeScript throughout, strict mode enabled
- App Router structure (not Pages Router)
- Tailwind CSS configured with design tokens pulled from @DESIGN.md
  (colors, font family, spacing scale) — do not use default Tailwind palette
- Set up a shared component library under /components/ui (buttons, cards,
  inputs, modals) styled per @DESIGN.md before building feature components
- Mobile-first responsive breakpoints — this app will primarily be used on phones

### Charts — Recharts

- Use Recharts for: category breakdown (pie/donut chart), monthly spend trend
  (line chart), budget progress (custom bar/progress component)
- Wrap Recharts components in a reusable /components/charts folder so chart
  styling (colors, fonts, tooltips) stays consistent with @DESIGN.md and
  isn't repeated per chart
- Charts must be responsive and render correctly on mobile viewport widths

### Backend — Next.js API Routes

- Use Next.js Route Handlers (app/api/\*/route.ts) for all backend logic in v1
- Structure API routes by resource: /api/transactions, /api/categories,
  /api/budgets, /api/insights
- Each route handler should validate input with Zod before touching the database
- Keep business logic (auto-categorization rules, recurring detection logic)
  in separate /lib functions, not inline in route handlers — so it's testable
  and reusable later if we move to a separate Express service

### Database — PostgreSQL via Supabase

- Use Supabase for both Postgres hosting and Auth (see below) to keep the
  stack minimal for v1
- Write the schema as SQL migration files, not just Supabase dashboard
  clicks — so the schema is version-controlled
- Required tables:
  1. categories — id, user_id, name, icon, color, is_default
     (seed default categories: Food, Transport, Shopping, Bills,
     Entertainment, Health, Rent, Subscriptions, Other)
  2. transactions — id, user_id, category_id, amount, type
     (income/expense enum), note, date, created_at
  3. budgets — id, user_id, category_id, monthly_limit, month, year
  4. recurring_transactions — id, user_id, merchant_name, amount,
     frequency, last_seen_date
- Enable Row Level Security (RLS) on every table — users must only be able
  to read/write their own rows. Write the RLS policies as part of the
  migration, not as an afterthought
- Use the Supabase JS client (@supabase/supabase-js) with a typed client
  generated from the schema (supabase gen types typescript)

### Auth — Supabase Auth

- Email/password + Google OAuth sign-in
- Use @supabase/ssr for proper Next.js App Router session handling
  (server components + middleware)
- Middleware to protect all routes except /login and /signup — redirect
  unauthenticated users to /login
- Store the Supabase user_id as the foreign key across all tables
  (matches auth.users.id)

### Hosting — Vercel

- Project must build cleanly with `next build` with zero warnings before
  considering any feature "done"
- Environment variables needed: NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (server-only,
  never exposed to client)
- Set up a .env.example file listing all required env vars with placeholder
  values and comments explaining where to get each one
- No custom server config needed — keep it deployable with zero-config
  Vercel defaults

## Deliverables for this session (in order)

1. Next.js project initialized with TypeScript + Tailwind, folder structure
   proposed (app/, components/, lib/, types/)
2. Tailwind config wired to @DESIGN.md tokens — confirm before moving on
3. Supabase schema as SQL migration files (all 4 tables + RLS policies)
4. Supabase client setup (browser client, server client, middleware)
   following @supabase/ssr patterns
5. Auth pages: /login, /signup with email/password + Google OAuth button
6. .env.example file with all required variables documented

Confirm the folder structure and Tailwind token mapping with me before
generating the Supabase migration files.
