# Alloc V1.0 readiness

Status: V1.0.0 candidate. Publication requires explicit owner approval.

## Acceptance evidence
The owner confirmed V0.4 PASS for core budgeting regressions, clean setup, JSON backup/restore, Windows installation, GitHub-hosted updates, notifications, silent installation/relaunch, financial preservation across updates, and pre-update backups. This supersedes the older empty-profile V0.3.1 test.

V1.0 contains branding and stabilization only: Alloc, Your paycheck. Your plan., an original A-monogram icon, isolated development profiles, accurate update status, and production package safeguards. Financial calculations, data schema, dependencies, repository, application ID, storage directory, executable filename, and update key are unchanged.

The update installer retains its legacy filename for V0.4.1 authentication. A byte-identical Alloc-named manual installer is also supplied. The separate fictional installed-app V0.4.1 → Alloc V1.0.0 rebrand test passed: same installation location, one registration, two renamed shortcuts with unchanged targets, silent relaunch, byte-identical financial storage and rendered accounts/history, restart, and JSON/recovery restoration.

Automated tests cover financial/history regressions, durable writes/corrupt-primary refusal, ordinary and recovery JSON restores, reminders/offline behavior, installer approval/backup failure, pending-install status, Ed25519 authentication, cached-file tampering, and downgrade rejection. The exact public Git history and packaged release require fresh privacy and signature audits.

## Post-publication V0.4.1 → Alloc V1.0.0 acceptance
1. Export a JSON backup and keep it locally. Privately note balances, bills, settings, and history; do not upload them.
2. Check the alert or About & Updates. Download and explicitly approve Install & restart.
3. Confirm silent installation, relaunch as Alloc 1.0.0, the existing installation folder, one Windows installation entry, and no leftover duplicate shortcuts.
4. Compare records/settings, close/reopen, and compare again.
5. Check that a timestamped pre-update snapshot exists. Verify restores in a separate fictional test profile, or export/preserve the current budget before deliberately restoring an older snapshot.
6. Report pass/fail and nonfinancial error text only.

This exact live V1.0 upgrade remains pending until owner confirmation after publication. Tests do not substitute for that final acceptance.

## Documented limitations
Windows Authenticode remains absent. Ed25519 verifies in-app updates but Windows reputation/security policy warnings remain possible.

A pending marker reports an unconfirmed install on the next successful launch. No error can be shown while the app is not running. Disk-full/power loss during actual executable replacement has not been tested on an isolated VM; automatic binary rollback is not claimed. Financial backups and a trusted reinstall remain the recovery path.

No V1.1, iOS, NAS integration, or new financial functionality is included.
