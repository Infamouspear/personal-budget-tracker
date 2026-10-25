# Desktop acceptance testing

## Passed

- Eleven existing browser-engine/form regression suites passed before the desktop wrapper was introduced. The budgeting engine is byte-identical between the validated browser build and desktop source.
- Public desktop tests use fictional data and verify allocation percentages, rollover, negative categories, debit/credit, old debt and repayments, recurring payments/transfers/skips, reimbursements, history filters/deletion/restoration/purge, and JSON roundtrip.
- Durable desktop storage tests cover validated import, restart, previous-copy preservation, invalid JSON/key rejection, interrupted temporary write, and corrupt-primary refusal.
- Updater state tests cover manual check/download/install, progress, private session credentials, interrupted downloads and retries, fail-closed missing-trust configuration, and refusal to install when a recovery backup cannot be saved. These use a simulated updater, not a live signed release.
- An actual NSIS per-user x64 installer completed with exit code 0 in an isolated test directory. The installed app launched a fresh profile, rendered the budget, and exposed About & Updates.
- Runtime reported sandbox=true, contextIsolation=true, nodeIntegration=false, and require unavailable in the renderer.
- The installed app loaded a fictional JSON backup into its isolated data store and rendered the expected accounts/history; the next process launch, without reimport, produced identical output. Browser backup selection/confirmation is covered by the earlier form tests; native file-picker interaction remains a manual acceptance step.
- Production dependency audit: zero known vulnerabilities at time of build.

- Actual NSIS sequential upgrade from test 0.3.0 to test 0.3.1 passed. The persisted ledger SHA-256 was unchanged, and the installed higher version rendered the expected fictional accounts/history. Uninstalling the test installation retained its isolated financial files.

## Remaining release acceptance

A real GitHub update from one published version to another cannot yet be tested because the repository has not yet been published by its owner. Ed25519 authentication now provides a secure alternative without a paid Windows certificate. A manual sequential-installer upgrade is a separate test and does not prove live updater authenticity or installation behavior. Complete that authenticated two-version test, including disconnect/retry and verification failure, before treating updating as production-ready.

Manual acceptance should also cover the native backup file picker, Windows SmartScreen/signature experience, and installation on a separate clean Windows account/machine. Never test by importing a real financial backup into public CI or publishing a screenshot of a real budget.

Ed25519 tests pass for valid signatures, wrong keys, tampered manifests, app/version binding, rollback rejection, installer hash/size mismatch, cached download revalidation, mutation before installation, and chaining a future Authenticode verifier.
