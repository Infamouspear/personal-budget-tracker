# Alloc build and release process

The existing repository remains Infamouspear/personal-budget-tracker. Publishing a draft requires the owner's explicit approval. No signing key or financial record belongs in source, Git history, logs, CI artifacts, or release assets.

## Trust and signing
Keep the existing Ed25519 private key outside the repository and installation/data directories, with a protected offline copy. GitHub's release environment holds UPDATE_SIGNING_KEY, the base64 PKCS8 PEM, restricted to v* tags. Only the public key is packaged. Never print the private key or change it casually after distributing an app.

The signed manifest binds the stable channel, application ID, version/tag, update artifact name, size and SHA-512. A checksum in latest.yml alone is not authentication. Missing/invalid signatures, wrong keys, changed installer bytes, unexpected artifacts and lower/equal versions fail closed. Cached files are verified again before installing.

Windows Authenticode is not configured. To add it later, retain Ed25519, configure the exact publisherName and supported signing credentials, and require both verifiers. Do not bypass Windows warnings or replace a verifier with a no-op.

## Branding compatibility
Visible product/shortcut names are Alloc. Keep appId com.weekbyweek.budget, package name week-by-week-budget, executableName Week by Week Budget, and %APPDATA%\\WeekByWeekBudget unchanged. Preserve the key and public repository.

V0.4.1 requires the update artifact name Week-by-Week-Budget-Setup-VERSION.exe. Keep that filename and single-file latest.yml/manifest. Copy the exact installer bytes to Alloc-Setup-VERSION.exe for manual downloads. Both names refer to the same application; do not independently rebuild or sign the copy. The legacy executable name also lets existing renamed shortcuts retain a valid target.

## Approval-gated workflow
1. Run npm ci, npm test, source/history audits, and review the complete source change. Scan for known signing-key material without printing it. Use fictional fixtures only.
2. Set package.json and both root lockfile versions consistently; do not change dependencies for a version bump.
3. Commit only explicit audited paths. Before pushing, audit complete local history. Push main and the matching vX.Y.Z annotated tag only when preparing an authorized release.
4. The pinned Node 24 GitHub Actions jobs install locked dependencies, run regressions/history audits, verify tag/version, build NSIS, apply Electron fuses, sign the manifest, audit package contents, and verify authentication.
5. The workflow creates a draft containing the legacy update installer, identical Alloc manual installer, legacy blockmap, latest.yml, and release-manifest.json. Review the exact assets against the tag, hashes/signature, privacy scan and trusted feed.
6. Request publication approval for that concrete draft. Only then publish it as the latest stable release. Confirm anonymous public discovery and manifest authentication.
7. Perform owner-controlled V0.4.1 → Alloc V1.0.0 acceptance using V1-READINESS.md. Keep financial backups local.

No updater token is needed for public releases. Never bundle publisher credentials. Keep release assets immutable after publication; use a new version for a necessary correction.

## Runtime safety
Automatic checks start about 30 seconds after launch and repeat every six hours. Remind Later suppresses the same banner for 24 hours. Downloading, installation and restart require approval; install-on-quit and downgrade/prerelease opt-in remain disabled.

The installer is authenticated after download and immediately before handoff. A validated, flushed, read-back recovery snapshot must succeed first. Installation reuses the current executable directory, runs silently, and relaunches. Pending-update status supports failure reporting on the next successful launch; it is not transactional executable rollback.

Records remain independent of installed files. See README.md for installation/backup/recovery, SECURITY.md for boundaries, and TESTING.md for test coverage.
