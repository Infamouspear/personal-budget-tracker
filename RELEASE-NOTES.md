# Alloc V1.1.0

Quick Add makes everyday purchases faster, and weekly limits show how much of an allowance remains without moving or creating money.

- Amount-first Quick Add with remembered category/payment choices, one-click favorites, optional merchant/description, and immediate Undo.
- Configurable weekly limits within existing categories, a chosen week-start day, overspending warnings, and historical weekly review.
- Automatic weekly reset without allowance rollover or changes to fund balances.
- Purchases remain editable/deletable in the existing full Purchase form and Transaction History.
- Limits, presets, defaults, and timestamps persist and are included in JSON backups.

Existing financial records and backups remain supported. Existing purchases are not automatically assigned to weekly limits. Changing a limit amount or week-start day also updates historical comparisons. Weekly spending counts purchase amounts; repayments do not count again, and reimbursements do not automatically restore an allowance.

The Windows updater, notifications, Ed25519 authentication, approved silent installation, and pre-update recovery backups are retained. No mobile/PWA changes are included.

All nine owner acceptance tests passed in the isolated test build. After publication, export a local backup and test the installed upgrade, data preservation, and recovery. Windows Authenticode signing remains unavailable; Ed25519 authenticates in-app updates.
