Here are solid references, split by what you actually need:

## Design Inspiration (UI/UX for your dashboard)

- **Dribbble** — search "expense tracker dashboard" or "finance dashboard UI" → hundreds of Figma-quality concepts you can screenshot for layout ideas
- **Mobbin** (mobbin.com) — real screenshots from live production finance apps (Mint, YNAB, Cred, Walnut) organized by screen type (onboarding, dashboard, transaction list)
- **Ramotion's expense tracker case study** — good example: visually engaging dashboard with graphic spending trends, bottom nav for core features, and interactive expense categories using icons and percentages

## Live Apps to Study (especially India-relevant)

- **Cred** — best-in-class Indian fintech UI, great for card/payment tracking patterns
- **Walnut** / **Money View** — Indian expense trackers with SMS-based auto-tracking (good reference for your "low-effort" goal)
- **YNAB (You Need A Budget)** — the gold standard for budget-limit UX, though it's more complex than what you need for v1
- **Copilot Money** — beautiful, minimal design, great chart/insight patterns worth copying

## Component/Chart Libraries (for actually building it)

- **Tremor** (tremor.so) — pre-built React dashboard components (cards, charts, KPIs) built for Tailwind, ridiculously fast to wire up for a finance dashboard
- **shadcn/ui** — if you want full design control with clean primitives
- **Recharts** (recharts.org) — for the pie/bar/line charts themselves

## Practical starting point

I'd actually recommend cloning the **Tremor dashboard templates** (they have a free finance/analytics starter) as your base layout, then swapping in your own data model — that alone could save you 3-4 days of UI work.

Want me to pull an actual Tremor or Dribbble dashboard screenshot so you can see the pattern before you start building?
