# Authenticated updates for Windows builds without Authenticode

## Investigation

The pinned stable electron-updater 6.8.11 can process unsigned NSIS installers. Its Windows verifier returns without an Authenticode check when no publisherName is configured; that behavior by itself is not a secure publisher-authentication mechanism. SHA-512 in latest.yml detects corruption but an attacker who can replace that metadata can also replace its hash. We do not rely on that bypass.

The stable v26 documentation supports a custom `NsisUpdater.verifyUpdateCodeSignature` function. This app replaces it with real Ed25519 verification when no Windows signer exists. A nonempty verification marker is embedded in app-update.yml so the hook runs. The marker is a routing identifier, not a claim of a Windows certificate. Mandatory application checks run after download and immediately before install as well, so the updater's cache fast path cannot bypass authentication. When a real Windows publisher is configured, the original Authenticode verifier is chained before Ed25519 verification.

Some online electron-builder documentation describes signed manifests in the unreleased v27 line. This project stays on the installed stable v26 builder and implements the bounded manifest verification explicitly rather than assuming those future APIs exist.

## Trust model

The initial app contains a pinned Ed25519 public key. Public GitHub Releases host a signed release-manifest.json alongside latest.yml and the installer. The manifest binds schema, stable channel, app ID, exact newer version/tag, artifact name, size, and SHA-512. The app accepts only the configured public GitHub repository's manifest URL with bounded HTTPS redirects and a small response limit. Public keys are never fetched from the update server.

Missing/invalid signatures, changed installer bytes, wrong keys, wrong app/channel/version, lower/equal versions, and unexpected artifacts are blocked. No check, download, or installation is automatic; users approve each stage. Failed updates leave financial records alone. A recovery snapshot is required before installation.

This protects against malicious replacement of release assets without the private signing key. It does not make an already-compromised Windows account safe, establish the human publisher's identity to Windows, prevent a server from withholding updates, or authenticate an initial installer obtained from an untrusted source. Windows can still warn about unknown publishers. The initial installer should be distributed through the owner's trusted channel, with its hash verified independently when practical.

## Key management

The private key was generated outside the repository and restricted to the current Windows account. Only the public key is in release-config.json and packaged apps. Keep a protected offline backup. The private key must never be committed, packaged, logged, uploaded as a release asset, or included with financial backups. Configure it only as the protected GitHub Actions `UPDATE_SIGNING_KEY` secret. Rotate keys through a release authenticated by the existing key; losing or compromising it requires a trusted recovery/bootstrap process, never accepting a replacement key fetched from the server.

To use a different key before the first public release, run scripts/create-update-key.cjs with a new external directory, secure the resulting private file, update all bootstrap installers, and rerun the complete audit and verification tests. Do not regenerate keys casually after distributing the app.

## Remaining acceptance

Local cryptographic tests and Windows installer-upgrade tests pass. Public releases 0.3.0 and 0.3.1 were built by GitHub Actions and independently audited. An actual public-feed updater integration test passed check/download, real cancellation and retry, manifest/installer verification, tampered-copy rejection, and unchanged fictional ledger hash. The test did not install an update. The owner confirmed the public desktop installation/restart with an empty profile. V0.4 tests populated fictional data and silent installation locally; production-release acceptance remains pending. See V1-READINESS.md.

Sources: https://www.electron.build/v26/docs/win/ ; https://nodejs.org/api/crypto.html ; installed electron-updater 6.8.11 NsisUpdater.js and AppUpdater.js cache path.
