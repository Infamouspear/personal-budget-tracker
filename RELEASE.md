# Windows build and GitHub release process

## GitHub owner authorization

Use GitHub Desktop → File → Add local repository, select this folder, then Publish repository as `Infamouspear/personal-budget-tracker`, public. Publishing through GitHub Desktop creates the origin remote. If an empty repository already exists online, set its URL in Repository settings and push the existing main branch. Do not initialize a separate README/history remotely. GitHub authentication occurs in GitHub Desktop; do not paste credentials into source or chat. No repository-creation connector is available in the current session, so this step requires the owner.

Before pushing, run `npm test` and `node scripts/audit-history.cjs`. The complete initial history was audited before delivery. Only explicit source paths are committed. Never force-add ignored files. Tests use fictional figures and labels. Real browser exports, data files, screenshots, installer outputs, signing keys, credentials, personal configurations, and node_modules must remain outside Git history.

## Update signing without a paid Windows certificate

Ed25519 release authentication is now required for published releases. The app embeds only a public key; its private counterpart must remain outside the source repository. Set the base64 encoding of the PKCS8 private PEM as the protected GitHub `release` environment secret `UPDATE_SIGNING_KEY`. Never place it in a workflow file, repository variable, issue, chat, or release asset. The owner must transfer the private key into the secret through GitHub's secure settings and keep an offline recovery copy.

The exact installer SHA-512, size, stable version, release tag, application ID, and artifact name are signed in release-manifest.json. That public manifest accompanies the installer and latest.yml. Missing, changed, wrongly signed, downgraded, or cross-application updates fail closed. GitHub metadata alone does not authorize an installer.

No Windows certificate is currently available. Windows may show an unknown-publisher warning; cryptographic update signing does not create Windows publisher reputation or bypass OS policy. The first installer must come from a trusted source. The provided local installer embeds the initial public key.

### Adding Windows signing later

Keep the Ed25519 key and manifests. Add an Authenticode certificate or supported signing service, set publisherName to the exact signer identity, and configure signing credentials. The current release script supports PFX-compatible `CSC_LINK` and `CSC_KEY_PASSWORD`; hardware or cloud signing needs a matching provider integration. With publisherName configured, builds require Windows signing and updates must pass **both** Authenticode and Ed25519 checks. Do not replace either verifier with a no-op.

## Versioning and repeatable release

1. Run npm ci and npm test; inspect the source and full-history audits.
2. Configure the GitHub `release` environment with review protection and the UPDATE_SIGNING_KEY secret (plus Windows signing secrets if configured).
3. Update the version with `npm version patch` (or minor/major as appropriate), producing a matching `vX.Y.Z` Git tag. Commit release-config changes before tagging.
4. Push main and the version tag. The pinned GitHub Actions workflow installs locked dependencies, tests, audits complete history, builds NSIS, audits packaged app contents, and verifies Ed25519 installer authentication, plus Authenticode if configured.
5. It creates a **draft** GitHub Release containing only the installer, blockmap, latest.yml, and release-manifest.json. Review its files and publish the draft manually. Builds lacking a valid Ed25519 release signature are never published by the workflow.

Source is public and update downloads use public GitHub Releases, so users need no token. If releases ever become private, do not bundle a publisher token: the app supports a read-only token supplied for the current app session only, limited to Contents: Read on that repository. It is not saved in financial files, backups, logs, or local preferences.

## User-controlled updates

Settings → About & Updates → Check for updates → Download update → Install & restart. There is no background check, automatic download, automatic install-on-quit, downgrade, or prerelease opt-in. The release manifest is authenticated before enabling download. The full installer is checked after download, including cached downloads, and again immediately before installation. A recovery snapshot must save successfully before the app hands control to NSIS. Failed checks and interrupted downloads retain the running app and financial records.

The pinned stable electron-updater has a supported custom Windows verification hook. This app uses it for Ed25519 installer authentication rather than accepting unsigned bytes. When Windows signing is added, the original Authenticode verifier is chained first. Differential and web installers are disabled to keep this path restricted to one fully authenticated NSIS installer.

The public repository and releases 0.3.0/0.3.1 now exist. Real GitHub check/download, interruption recovery, signature/content verification, and tamper rejection passed against a fictional ledger. The remaining acceptance step is owner-controlled installation/restart in the actual desktop app and confirmation of unchanged records/balances. Do not describe that final step as passed until it is confirmed.

Official references: https://www.electron.build/v26/docs/win/ ; https://nodejs.org/api/crypto.html ; https://www.electronjs.org/docs/latest/tutorial/security .
