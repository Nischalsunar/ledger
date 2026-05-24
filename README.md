# Ledger — Personal Finance Calculator

A self-contained, single-file personal finance toolkit. All math runs in your browser; nothing is sent anywhere.

**Live**: https://nischalsunar.github.io/ledger/

## Features
- Budget & cashflow with tiered expenses (Primary needs · Secondary · Subscriptions)
- 5-year salary / expense / leftover projection
- Household & roommate cost-sharing with proportional split
- Savings & investing with horizon, platform, monthly-or-yearly return
- Tax estimator (2025 federal brackets + state + city + FICA)
- Auto & vehicle: loan amortization + ownership costs + animated car preview
- Debt payoff: snowball/avalanche + auto-optimize + per-debt type/date
- AI assistant (powered by Claude — bring your own API key)
- Light/dark mode
- Onboarding wizard for first-time setup

## Tech
Single static HTML. React 18 + Framer Motion + Recharts loaded from esm.sh via an import map.
In-browser Babel for JSX transformation.

No build step, no backend. Just open the file (or visit the Pages URL).
