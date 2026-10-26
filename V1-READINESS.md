# V1.0 readiness — V0.4 local reliability work

Status: not yet approved for V1.0 or publication. V0.4 may be prepared as a draft; publishing requires explicit owner approval. The owner's installed production application remains V0.3.1.

## Acceptance evidence

The owner confirmed a real public GitHub V0.3.0 → V0.3.1 update and successful launch. That application had no financial records before updating, so this result does **not** establish data preservation.

V0.4 adds a populated-data regression using fictional opening account/card balances, allocation preferences, recurring expense/flexible/transfer bills, a payday, debit/credit purchases, repayment, and transaction history. A separate Windows test identity (`com.weekbyweek.reliabilitytest`, Budget Reliability Test) avoids replacing the production installation. Two local test versions exercise the actual NSIS updater/installer with an ephemeral Ed25519 test key and a loopback test feed. No production signing key or real financial backup is used.

- Installed application import and close/reopen: matching accounts, history, bills, settings, and storage.
- Actual silent updater launch: `--updated`, `/S`, `--force-run`, and the existing installation directory. The higher version relaunches unattended.
- Populated financial storage SHA-256 and rendered accounts/history remain identical after upgrade and another restart.
- The existing installation directory, one uninstall registration, and two shortcut paths remain consistent.
- Timestamped recovery snapshots are validated and read back before handoff. Recovery snapshots and ordinary exported JSON restore successfully into separate fictional installed-app profiles.
- The normal Restore backup action accepts both ordinary JSON exports and pre-update storage snapshots, with validation and existing permanently-deleted-ID protections retained.
- Automated tests cover a failed backup, installer-start failure, pending-update failure detection after restart, interrupted download/retry, incorrect signatures/keys/content, and rollback rejection. Full machine power-loss recovery is not established by these tests.
- Notification service and renderer tests cover launch/six-hour checks, published/newer eligibility, 24-hour reminders persisted across restart, concurrent-operation avoidance, quiet offline/API failures, Settings indicator, release notes, View Update navigation, and no automatic downloading/installation. A fictional browser preview verifies the visible banner, dismissal, and updater navigation.

An initial test attempt exposed Windows discarding an inherited profile variable during installer relaunch. It was stopped; the production financial file's modification timestamp remained unchanged. Test builds now require an isolated profile and embed the test destination when needed, so a missing environment variable cannot fall back to production financial records. The corrected installed-app regression passes.

## Behavior and recovery boundaries

Fresh installers remain interactive. After explicit Install & restart approval, the updated app requests silent installation, verifies the installer again, creates a timestamped recovery backup, and passes its existing executable directory to NSIS. Download and install-on-quit remain disabled. Ed25519 trust, version binding, and downgrade rejection remain required.

Automatic checks begin 30 seconds after launch and repeat every six hours. They request release metadata and authenticated manifests only. Financial records and backups are never uploaded. Remind Later suppresses the same version's banner for 24 hours while retaining the Settings indicator. Offline failures do not display a popup.

The pending-update marker lets the next app launch report an unsuccessful or unconfirmed installation while retaining recovery backups. It cannot display an error while the app is not running, restore replaced executable files after an operating-system failure, or guarantee transactional rollback of a partially completed Windows installation. Financial data remains separate from application files.

## Remaining V1.0 blockers

1. Owner-approved, production-key GitHub release acceptance with populated fictional data, including the final notification-enabled build. Local test versions are not published releases.
2. Clean Windows account/machine testing, normal interactive fresh-install review, native backup file-picker acceptance, and the final Windows desktop notification visual check. A browser preview and test import hook do not substitute for every native interaction.
3. Controlled failure during actual installer file replacement (disk-full/interruption) and documented executable repair/reinstallation on an isolated VM. Automatic binary rollback is not implemented or claimed.
4. Privacy, package, signing, tag/version, and complete reachable-history audits must pass again for the exact approved release artifacts before publication.

Windows Authenticode is still absent. Ed25519 authenticates in-app update contents, but Windows may show unknown publisher/SmartScreen warnings and enterprise policy can block execution. This is a deployment limitation, not a reason to disable security protections.

The currently installed V0.3.1 uses its original interactive update request. Installing V0.4 may therefore still show the wizard once; silent behavior takes effect for updates initiated by the corrected V0.4 app.
