# Alloc V1.0 verification

## Owner-confirmed V0.4 results
PASS: core budgeting regressions, clean setup, JSON backup/restore, Windows installer, public GitHub updates, automatic notifications, silent installation/relaunch, financial-data preservation, and pre-update recovery backups.

Earlier testing included a populated fictional installed-app upgrade with identical storage SHA-256 and rendered accounts/history; recovery and exported JSON restored into separate fictional profiles. These tests never require a real backup in CI.

## Automated suites
Run npm test. Suites cover allocations/rollover/negative funds, cards and repayment without double-counting, recurring bills/transfers/skips/reimbursements, history restoration/purge dependencies, durable storage and interrupted writes, validated backups, notifications and navigation/reminders/offline behavior, startup profile isolation, safe update status, signatures/keys/version binding, cached-installer tampering, and downgrade rejection.

Production package audits reject test-profile metadata, records, backups, private keys, and test files. Source and complete reachable history are audited separately. Release artifacts are independently checked against their Git tag, pinned key, update feed, installer hash/size, source, and Electron fuses.

## V1.0 branding compatibility
The internal application ID, executable name, storage folder, repository and key remain stable. Only visible product/shortcut labels change to Alloc. Test the old-branded → Alloc upgrade in a separate Windows test identity with fictional balances, bills, settings and history. Verify one installation registration, old shortcuts replaced by Alloc shortcuts, the same directory, silent relaunch, stable records and restored backups.

The legacy update installer and Alloc manual installer must be byte-identical; the manifest/latest.yml retain the legacy artifact name required by V0.4.1.

## Final acceptance
The real V0.4.1 → V1.0.0 GitHub upgrade is performed only after explicit publication approval. Follow V1-READINESS.md. Do not publish financial exports or screenshots. Power-loss/disk-full executable rollback on a separate VM remains unverified and is documented as a limitation.
