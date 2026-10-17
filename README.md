# CrossWay Command (admin)

Internal operations console for CrossWay. Built with React 19, Vite and Motion for animations. It is a **static site**:
there is no backend, and all data is demo data held in the browser. Changes reset on reload.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # static output in dist/
npm run preview  # serve dist/ locally
```

`dist/` can be hosted on any static host (GitHub Pages, Netlify, S3, Nginx). Paths are relative and screens use
hash URLs (`#/payroll`), so no server rewrites are needed.

## Motion

Calm Material 3 motion using the **standard** spring scheme (no overshoot, everything settles in about 300 ms) from
the shared `design-tokens/`, through the TypeScript library in `src/motion/`:

- KPI count-up, and charts that draw in with a 40 ms stagger
- Table rows that insert and delete with height + fade; FLIP re-ordering when you sort a column
- Approve / reject buttons that morph to a check inline, with toasts from the bottom
- A navigation rail that expands and collapses on a spring, with a morphing indicator
- Light and dark themes generated from the brand seed colour (Material dynamic colour), with a circular reveal
- `prefers-reduced-motion` turns movement into fades

`npm run typecheck` checks the motion library. Spec, accessibility and performance docs: [`docs/motion/`](docs/motion/README.md).

## Modules

| Code | Screen | Highlights |
| --- | --- | --- |
| A1 | Dashboard | Animated KPI counters, fill-rate chart, revenue mix, exceptions inbox |
| A2 | Live operations | Shift board with assign, surge, standby, geofence accept/reject |
| A5/A6 | Requisitions | AI match list, over-invite (130%) warning, credit-hold block |
| A4 | Candidates | Tier filters, global search, empty state, CSV export |
| A8 | Verification | KYC checks, override/reject/re-upload with mandatory reason |
| A9 | Attendance | Disputes, missing check-out, geofence, OT approval |
| A10 | Billing | Ageing, credit limits, invoices and credit notes |
| A11/A12 | Payroll & payouts | Minimum-wage block, payout batch with MFA (demo code `246810`, lockout after 3 tries) |
| A13 | Growth | Ambassador rewards, clawback, budget cap |
| A20 | Fraud & quality | Human-decided holds |
| A15 | Compliance & audit | Licences and a live audit log of every action you take |
| A16 | Support desk | Grievances and SLAs |
| A21 | Configuration | Rate card validated against minimum wage; RBAC matrix |

Use **Viewing as role** in the sidebar to see role-based access, the city picker for the not-yet-live city state,
and **Edge cases** in the top bar to jump straight to each edge case.
