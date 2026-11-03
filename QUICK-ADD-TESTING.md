# Quick Add and weekly spending — pre-release validation

Status: all nine owner manual acceptance tests passed in the isolated Windows test application. V1.1.0 production release preparation; publication requires owner approval. No installed financial records accessed.

## Accounting behavior

- Quick Add creates the same `purchase` event as the full Purchase form. Debit reduces checking once; credit increases the selected card's new debt and repayment reserve once.
- Weekly limits contain no cash or allocations. Each purchase can link to one limit belonging to its category. Existing purchases are left unlinked unless edited.
- Spending is the gross amount of active linked purchases, using the purchase date. Card repayments do not count again. Reimbursements retain their existing accounting and do not automatically restore a weekly allowance.
- Weeks use the selected starting weekday and local calendar dates. Remaining allowance resets without rollover. The dashboard refreshes after a date boundary (within 30 seconds while running, or when the window regains focus).
- Historical review includes linked purchases by week. Editing a limit amount or week-start day updates historical comparisons too; limits are not versioned. Disable a limit to retain its history. Changing an existing limit's category requires disabling it and creating a new limit.
- Purchase timestamps include the local UTC offset and remain unchanged when correcting the purchase date. Quick Add uses the save-time local date unless manually corrected.
- Defaults, favorites, and limits live in the existing saved budget and JSON backup. No storage identity or update settings change.

## Focused owner checklist

Use an isolated test copy with fictional data. These controls are included in the V1.1.0 release candidate.

1. Set a Food limit of $20 under Essentials, choose your week-start day, and save a Food / Essentials / debit favorite.
2. Open Quick Add: the amount should already have focus. Enter $7.50 and save without a merchant or description. Confirm one purchase, a $7.50 Essentials reduction, a $7.50 checking reduction, and $12.50 Food remaining.
3. Reopen Quick Add: confirm remembered category, payment method, and allowance. Change categories and choose a favorite with one click. For debit, the card selector must be hidden.
4. Enter $15 against Food. Confirm $0 remaining plus $2.50 over the weekly limit; saving must remain possible even when Essentials is negative.
5. Use Undo immediately after a purchase. Confirm its effects reverse and its record is marked deleted. Double-clicking Save must create only one record.
6. Use a credit favorite. Confirm checking is unchanged, the selected card and reserve increase once, and repayment does not count toward Food again.
7. Edit a purchase's amount and date in the original Purchase form. Confirm its original timestamp remains, the selected weekly allowance is retained, and weekly history recalculates. Delete and restore it separately.
8. Review an earlier week. Confirm its purchases, spending, remaining allowance, and overspending. At the next configured boundary, confirm a fresh allowance with no rollover and no change to funds, cash, debt, or reserves.
9. Edit or disable a limit; edit or remove a favorite. Close and reopen the test application and confirm saved preferences and transactions persist.
10. Export and restore the fictional JSON backup. Confirm limits, favorites, timestamps, purchases, bills, balances, and settings match.
11. Confirm Payday, the full Purchase form, card payments, negative rollover, recurring bills/transfers, and fund-shortfall resolution still behave normally.

## Developer verification

- `npm test`: nine suites pass, including weekly accounting, durable persistence/backup restoration, and existing ledger/updater/security regression suites; source allowlist and secret-pattern audit passes.
- `scripts/test-spending-ui.cjs`: real Electron renderer test using a newly created fictional profile under ignored `artifacts/`. Checks focus, amount-only entry, duplicate submissions, favorites, debit/card effects, Undo, settings, refresh persistence, full-form edits, and simulated weekly reset without balance changes. Set `ALLOC_TEST_ELECTRON` to the local Electron executable before running with Node.
- Visual inspection: Quick Add screenshot reviewed.
- All nine owner manual acceptance tests passed. Production installed-upgrade acceptance remains a post-publication step.
