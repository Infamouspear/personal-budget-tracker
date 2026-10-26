# Alloc
**Your paycheck. Your plan.**

Alloc is a manual personal budget tracker for Windows, built for fluctuating paychecks, recurring bills, rollover funds, savings, and debt repayment. It was previously named Week by Week Budget. V1.0 stabilizes the existing app without new budgeting features or a financial-data migration.

## Install or upgrade
Download **Alloc-Setup-1.0.0.exe** from the [GitHub Releases](https://github.com/Infamouspear/personal-budget-tracker/releases) once V1.0 is published. Fresh installation is interactive and per-user. Existing V0.4.1 users should update through Settings → About & Updates; installation stays in the existing folder. The Start Menu and desktop shortcuts become Alloc.

The repository, application ID, data directory, executable identity, and Ed25519 key stay unchanged. The legacy Week-by-Week-Budget-Setup filename remains in the update feed because earlier versions require it. The Alloc-named installer is an identical copy for manual installation, not a second application.

For a new budget, enter opening balances through Initial Financial Setup or restore an existing JSON backup. Do not enter opening balances again after an upgrade.

## Updates
The app checks GitHub about 30 seconds after launch and every six hours while running. View Update opens release notes and the download option. Remind Later hides that version's banner for 24 hours while keeping the Settings indicator.

Downloading and installation require approval. Before Install & restart, the app authenticates the installer, saves and validates a timestamped recovery snapshot, then installs silently and relaunches. Financial data is never uploaded. Export a separate local backup before important upgrades.

Windows Authenticode is not configured; Windows may show an unknown-publisher/SmartScreen warning. Ed25519 authenticates in-app update contents but does not establish Windows publisher reputation or bypass OS policy.

## Backups and recovery
Choose Export backup regularly. Keep the JSON somewhere safe outside the installation folder. Restore backup accepts normal exports and pre-update recovery snapshots; review the confirmation before applying it. Keep a newer export before restoring an older snapshot. Permanent-deletion protections remain in effect.

Records remain at `%APPDATA%\\WeekByWeekBudget\\records`. About & Updates shows the exact location. The primary is financial-data.json, the previous successful copy is financial-data.previous.json, and timestamped pre-update snapshots are in records/backups. Updates and uninstall retain these files. Uninstalling is not a backup strategy.

If corrupt data prevents launch, close Alloc and first copy the entire records folder to a safe location. Preserve the unreadable primary. Copy a known-good financial-data.previous.json or pre-update snapshot to financial-data.json, then reopen and verify. Do not delete originals. Use Restore backup for a portable JSON export once the app opens. Do not upload financial files to public issues.

## Limitations
- Manual USD tracking only. No bank connections, actual payments/transfers, cloud synchronization, telemetry, or budget uploads.
- Windows x64 per-user installation. No iOS or NAS integration in V1.0.
- Records/backups are not encrypted by Alloc. Protect your Windows account and keep independent backups.
- A partially completed Windows install may require reinstalling a trusted installer. Transactional binary rollback after power loss or disk-full replacement is not guaranteed.
- Two installer filenames are intentional for compatibility; their bytes are identical.

## Development
Use Node 24, npm ci, and npm test. npm start uses an isolated WeekByWeekBudget-Development folder. Test installers require BUDGET_TEST_ROOT or an embedded test destination; release builds ignore test-import environment variables and reject test-profile metadata in package audits. Never test against real financial records.

See RELEASE.md, SECURITY.md, TESTING.md, and V1-READINESS.md. The dependency lockfile is retained; V1.0 introduces no dependency changes.
