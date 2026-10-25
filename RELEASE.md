# Windows build and GitHub release process

## GitHub owner authorization

Use GitHub Desktop → File → Add local repository, select this folder, then Publish repository as `Infamouspear/personal-budget-tracker`, public. If an empty repository already exists online, push the existing main branch to the configured origin. Do not initialize a separate README/history remotely. GitHub authentication occurs in GitHub Desktop; do not paste credentials into source or chat. No repository-creation connector is available in the current session, so this step requires the owner.

Before pushing, run `npm test` and `node scripts/audit-history.cjs`. The complete initial history was audited before delivery. Only explicit source paths are committed. Never force-add ignored files. Tests use fictional figures and labels. Real browser exports, data files, screenshots, installer outputs, signing keys, credentials, personal configurations, and node_modules must remain outside Git history.

## Code signing — required for secure updates

No certificate is available yet. The provided unsigned installer is a testing artifact, not a trusted signed release. Windows may display an unknown-publisher warning. Do not disable Windows security controls to distribute it. Secure updates remain disabled until a properly signed bootstrap installer has been manually installed.

Obtain an Authenticode code-signing certificate or configure a supported signing service. This release script currently supports an existing PFX-compatible certificate through electron-builder `CSC_LINK` and `CSC_KEY_PASSWORD`; modern hardware-backed certificates or Azure signing services require a corresponding signing-provider integration before use. Keep keys and passwords in a protected GitHub Actions release environment, never in this repository or packaged app. A self-signed certificate is insufficient for ordinary public distribution unless separately trusted by the recipient.

Edit release-config.json with the exact certificate publisher subject, leave owner `Infamouspear`, repo `personal-budget-tracker`, private false, and set updatesEnabled true. Signature identity must remain compatible across releases. The release build requires signing secrets, forceCodeSigning, and pinned publisher identity; it fails rather than producing an unsigned release. The workflow additionally requires a valid Authenticode signature on the installer.

## Versioning and repeatable release

1. Run npm ci and npm test; inspect the source and full-history audits.
2. Configure the GitHub `release` environment with review protection and signing secrets.
3. Update the version with `npm version patch` (or minor/major as appropriate), producing a matching `vX.Y.Z` Git tag. Commit release-config changes before tagging.
4. Push main and the version tag. The pinned GitHub Actions workflow installs locked dependencies, tests, audits complete history, builds signed NSIS, audits packaged app contents, and verifies the installer signature.
5. It creates a **draft** GitHub Release containing only the installer, blockmap, and latest.yml. Review its files and publish the draft manually. Unsigned test builds are never automatically published.

Source is public and update downloads use public GitHub Releases, so users need no token. If releases ever become private, do not bundle a publisher token: the app supports a read-only token supplied for the current app session only, limited to Contents: Read on that repository. It is not saved in financial files, backups, logs, or local preferences.

## User-controlled updates

Settings → About & Updates → Check for updates → Download update → Install & restart. There is no background check, automatic download, automatic install-on-quit, downgrade, or prerelease opt-in. Progress is displayed. electron-updater verifies SHA-512 and Windows Authenticode against the configured publisher. A failed check, interrupted download, or failed verification leaves the running app and financial data intact. Retry with Check for updates. Before installation a financial recovery copy must save successfully; otherwise installation is blocked.

The unsigned 0.3.0 test build cannot securely bootstrap itself. Manually install the first signed version. Then test a second, higher signed version through published GitHub Releases before accepting production updating. Do not equate a manual installer upgrade with a verified live updater test.

Official references: https://www.electronjs.org/docs/latest/tutorial/security ; https://www.electronjs.org/docs/latest/tutorial/fuses ; https://www.electron.build/v26/docs/features/auto-update/ ; https://www.electron.build/win.html .
