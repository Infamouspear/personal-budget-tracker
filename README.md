# Week by Week Budget — Windows desktop 0.3.0

A manual, local personal budget tracker. No bank integrations, transfers, cloud synchronization, telemetry, or budget uploads. This repository contains application code and fictional tests only.

## Current delivery

The per-user Windows x64 NSIS test installer is unsigned. It preserves the existing budgeting engine and transaction-history cleanup. Updates are authenticated using Ed25519 signatures and a public key embedded in the app. A paid Windows certificate is optional; without one Windows can still show an unknown-publisher warning. Public release target: `Infamouspear/personal-budget-tracker` on GitHub. The public source repository is published. Release assets and live updater acceptance are being prepared.

Install the test EXE, launch Week by Week Budget, then use **Restore backup** to import a JSON export from the earlier browser application. Import is manual; the desktop app does not read another browser's storage. Keep the original backup. Settings → About & Updates displays the installed version and local data location.

## Local data and recovery

Actual records are saved under `%APPDATA%/WeekByWeekBudget/records/financial-data.json`, independent of the install directory. The application uses a fixed app ID and data directory across versions. Writes validate the budget, flush a temporary file, retain `financial-data.previous.json`, and replace the primary file. Failed saves retain the old ledger; a corrupt primary is never silently reset. To recover corruption, close the application, preserve both files, and replace the primary with the validated previous file. Normal portable exports use the app's Export backup control.

The NSIS uninstaller retains application data. Updates create a timestamped local recovery snapshot before installation. Uninstalling is not a backup strategy: export regularly. Local files are not encrypted by this application; Windows account permissions protect them. No update endpoint receives those files.

## Development

Use Node 24 or later. Run `npm ci`, `npm test`, then `npm start`. `npm run dist` builds an unsigned x64 test installer in `dist/`. Test builds permit an isolated test profile through `BUDGET_TEST_ROOT`; release builds ignore this setting. `BUDGET_TEST_IMPORT` imports a fictional fixture only in that isolated test profile. Neither variable belongs in normal use.

All runtime dependencies are locked in package-lock.json. The production dependency audit has no known vulnerabilities at the time of delivery. The default Electron icon is retained; visual redesign is outside this patch.

See RELEASE.md for signing and publishing, SECURITY.md for security boundaries, and TESTING.md for verified behavior and remaining acceptance work.

Cryptographic update signatures are separate from Windows Authenticode. See UNSIGNED-UPDATES.md for the trust model, key handling, and remaining live-release test.
