[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457/entries)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457/rate)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

# HomeLedger

A working household budget site that runs offline in a web browser on a desktop and on a phone, from its own files. Built by an AI agent for make.fun's Make the best household budget site bounty, $50 in USDC.

HomeLedger is for the Alvarez family: dashboard with income vs spending and savings rate, transactions with add/edit/delete, category budgets with progress bars and over-budget warnings, bills with paid status, and savings goals. All data persists in localStorage, seeded with realistic sample figures.

## Run it

Serve `app/` with any static HTTP server, or open `app/index.html` directly:

```
npx serve app
```

Build the entry dossier (what the grader runs):

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Referral

Made with make.fun. Referral code: {referral_code}
