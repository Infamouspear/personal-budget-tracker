# Security and privacy boundaries

- Budget data stays in a separate per-user Windows application-data directory. No server, telemetry, crashReporter upload, analytics, bank connection, or synchronization is started.
- Renderer content is local-only through a restricted custom protocol. CSP disallows network connections, remote scripts, frames, objects, and form navigation. External navigation, popups, webviews, and permission requests are denied.
- Node integration is disabled; sandbox, web security, and context isolation are enabled. Preload exposes named methods, not a general IPC sender or filesystem API. Every main-process request validates sender window, main frame, and exact local origin.
- Storage IPC accepts only known budget keys and validated JSON ledgers, with a size limit. Financial calculations remain in the audited engine. Store failures do not reset balances or overwrite corrupt data.
- Packaged Electron fuses disable RunAsNode, NODE_OPTIONS, and inspector arguments; ASAR-only loading and embedded ASAR integrity validation are enabled.
- Updates are manual and use the fixed public GitHub release repository. Requests contain version/platform metadata and download release assets; no financial data enters the update module. Logger output is disabled. Tokens are unnecessary for the configured public repository.
- Release builds require an Ed25519 private key matching the embedded public key. Metadata signatures bind the installer hash/size, app, version, tag, and name. Downloaded and cached files are checked again before installation. Unsigned manifests and unknown keys fail closed. Optional Windows signing adds the original Authenticode check; it does not replace Ed25519 verification. Installer artifacts are audited separately from source.
- Source and complete Git history are audited for forbidden data paths and secrets. Package contents are checked for data, backups, tests, keys, and older personalized development hints. These automated checks complement explicit source selection and review; they are not a universal proof against every possible secret encoding.

Report security concerns privately to the repository owner rather than attaching financial exports to public issues. This local app does not encrypt financial data at rest or replace Windows account/device security.
