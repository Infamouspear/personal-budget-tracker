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

GitHub releases 0.3.0 and 0.3.1 are published. The tagged Windows workflows passed with zero annotations after moving pinned checkout/setup-node actions to Node 24. Both GitHub-built installers were independently checked against their tags, Ed25519 manifests, exact hashes/sizes, packaged source, privacy scans, update feed, and Electron fuses.

A real electron-updater integration test (not a simulated network) used the public GitHub feed, current version 0.3.0, and an isolated fictional ledger. It authenticated 0.3.1, canceled a real download after progress began, recovered by checking/downloading again, verified the complete installer, rejected a deliberately modified copy, and retained the same ledger SHA-256. Automatic download/install-on-quit remained disabled, and installation was intentionally not invoked by the harness.

Final owner acceptance is still required in the installed desktop app: manually approve Install & restart from 0.3.0, confirm version 0.3.1, and confirm records and balances remain unchanged. Keep a local backup first. The successful earlier manual installer-upgrade test is recorded separately and does not substitute for this app-level live updater check.

Manual acceptance should also cover the native backup file picker, Windows SmartScreen/signature experience, and installation on a separate clean Windows account/machine. Never test by importing a real financial backup into public CI or publishing a screenshot of a real budget.

Ed25519 tests pass for valid signatures, wrong keys, tampered manifests, app/version binding, rollback rejection, installer hash/size mismatch, cached download revalidation, mutation before installation, and chaining a future Authenticode verifier.
