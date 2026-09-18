# Research baseline — WindowsRunner

- **Recorded:** 2026-09-18 UTC
- **Source repository:** `StepenkoAnatoli/WindowsRunner`
- **Pinned revision:** `main` at `406bc654a2e8aea02f1e4dfc36c9ba4ad8aa6fdd`
- **Pinned commit date:** 2026-09-17T17:25:36Z

This is a research record, not a vendored dependency. No WindowsRunner source,
packages, lockfiles, or product code are copied into `Claude-Koken-buffer`.

## Confirmed source facts

| Fact | Evidence inspected at the pinned revision | Buffer consequence |
| --- | --- | --- |
| Windows-first, local-first coding agent | Source `README.md` describes local sessions and user-selected models; source `AGENTS.md` calls it a local-first agent. | Buffer is designed as a local filesystem/Git protocol, not a hosted relay. |
| Express server + React UI + optional Electron shell | Source `AGENTS.md`, layout section. | No server/UI component is introduced here in bootstrap. |
| Providers use user-supplied keys, but mock/offline paths exist | Source `README.md`, `AGENTS.md`, and provider layout. | Buffer must not inherit provider configuration or key handling. It stays provider-neutral and keyless. |
| `AGENTS.md` applies | Source root includes `AGENTS.md`; it was read before defining this baseline. | Its safety and local-first constraints inform research only; it does not create a source dependency. |
| 22 TypeScript test modules | Recursive source tree count of `*.test.ts` is 22, all under `packages/server/test/` or `packages/web/test/`. | The future Buffer implementation should have its own focused tests; this count is a source baseline, not a Buffer test result. |
| CI needs no API key | Source `.github/workflows/ci.yml` says its fake SSE and mock providers need no key, and runs install/typecheck/test/build on Linux and Windows. | Buffer core CI must likewise remain API-key-free and avoid live model calls. |
| Node baseline is at least 20.10 | Source root `package.json` declares `node >=20.10`. | If a future TypeScript CLI adopts Node, it should explicitly choose and test a compatible support policy rather than relying on an implicit local version. |

## Applicable instructions read

The source `AGENTS.md` specified, among other things:

- strict TypeScript/ESM conventions;
- filesystem access guarded through safe path handling;
- actionable errors rather than stack traces for agents; and
- test, typecheck, and build checks, including fake provider patterns that do
  not require real API keys.

For this bootstrap, the directly applicable design principles are
cross-platform path containment, clear actionable validation, strict separation
of concerns, and no-real-provider testability. The source's server/UI/provider
implementation instructions do not cause code changes in this independent
repository.

## Scope decision

This branch is **research/bootstrap only**. It adds a documented file protocol,
a tracked directory skeleton, a copyable envelope template, an implementation
contract, and a source evidence record. It intentionally does **not** add:

- `package.json`, a CLI entry point, TypeScript source, dependencies, or build
  output;
- a GitHub workflow or a test suite for this repository;
- a WindowsRunner modification, plugin, or embedded adapter;
- provider calls, API keys, environment-variable loading, telemetry, or an API
  relay.

Therefore no TypeScript tests were run in this repository: none exist on this
bootstrap branch. The source test-count and CI properties above are verified
research inputs, not claims that this repository has executed them.
