# Changelog

## [0.1.9](https://github.com/SahilAggarwal2004/react-file-preview-engine/compare/v0.1.8...v0.1.9) (2026-02-13)

### Chores

* **deps:** Update @release-it/conventional-changelog, @types/react and release-it.  ([4b480b7](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/4b480b7dea2a618fea7477bd6cde4a9b2b1291f4))
* Rename `index.tsx` to `index.ts`.  ([f568fbb](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/f568fbb74e13f942b8b223d30363bf291ea119d7))

## [0.1.8](https://github.com/SahilAggarwal2004/react-file-preview-engine/compare/v0.1.7...v0.1.8) (2026-01-04)

### Code Refactoring

* Modularize `index.tsx`.  ([9f9d919](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/9f9d919e6d7d5628cb0a9bb94fdaa94babf476c6))

## [0.1.7](https://github.com/SahilAggarwal2004/react-file-preview-engine/compare/v0.1.6...v0.1.7) (2026-01-03)

### Code Refactoring

* Explicitly type return values for public APIs.  ([8e881bf](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/8e881bf8655e867b04973b5893d040fcca98389c))

## [0.1.6](https://github.com/SahilAggarwal2004/react-file-preview-engine/compare/v0.1.5...v0.1.6) (2026-01-03)

### Documentation

* Improve `customRenderers` and `additionalContext` documentation.  ([5e6b1b9](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/5e6b1b9025731f0ad9fbc7d534bdc41b57de048c))

## [0.1.5](https://github.com/SahilAggarwal2004/react-file-preview-engine/compare/v0.1.4...v0.1.5) (2026-01-02)

### Styles

* Remove unnecessary aspect-ratio from `rfpe-icon`.  ([dd7d790](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/dd7d7900aff02287f5d6ca2157ed53d36152146b))

## [0.1.4](https://github.com/SahilAggarwal2004/react-file-preview-engine/compare/v0.1.3...v0.1.4) (2026-01-02)

### Other

* replace explicit heights with aspect-ratio for `rfpe-icon` and `rfpe-loader-spinner`, add max-width fallback.  ([c6e4c8d](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/c6e4c8d0d752d1353b491ac4c7357e7d5eb1c215))

## [0.1.3](https://github.com/SahilAggarwal2004/react-file-preview-engine/compare/v0.1.2...v0.1.3) (2026-01-02)

### Chores

* Add `.env` file to .gitignore.  ([2a4bfa1](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/2a4bfa1de3571778343bebcd3ba2b8a1ef6c16ad))

### Styles

* Add `object-fit: contain` to `rfpe-image` and `rfpe-video`.  ([bba6f88](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/bba6f88f460109e9cb9f0a7a080453ebf8d81fd8))

### Code Refactoring

* Move `rfpe-container` and `rfpe-icon` to [@layer](https://github.com/layer) rfpe.  ([edf0024](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/edf0024d911234a25ab57e6c9f642fc286a3547e))

## [0.1.2](https://github.com/SahilAggarwal2004/react-file-preview-engine/compare/v0.1.1...v0.1.2) (2025-12-31)

### Bug Fixes

* Allow partial `RenderBehaviour` in `FilePreviewerProps`.  ([acea276](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/acea276c3a20337b9588aaf7cabfbd487bd65951))

## [0.1.1](https://github.com/SahilAggarwal2004/react-file-preview-engine/compare/v0.1.0...v0.1.1) (2025-12-30)

### Chores

* **deps:** Update @types/react, tsup and typescript.  ([3f443c3](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/3f443c3442bd6da37d8136f196d34e5149b20ab3))

### Bug Fixes

* Fix broken compare links in release-it changelog.  ([f920a6a](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/f920a6abe97f71a2fa0193e1ec48e92d8cde2301))

## [0.1.0](https://github.com/SahilAggarwal2004/react-file-preview-engine/compare/v0.0.5...v0.1.0) (2025-12-30)

### Chores

* Add release-it for automated versioning and changelog. ([81dc279](https://github.com/SahilAggarwal2004/react-file-preview-engine/commit/81dc279aeda1c573a6ff836b321a8f099cb62b5a))

## 0.0.4 (2025-12-30)

* **build:** Mark package as side effect free for JavaScript while preserving CSS imports.

## 0.0.3 (2025-12-30)

* **fix:** Improve file type and extension resolution by falling back to `fileName` when MIME resolution fails.

## 0.0.2 (2025-12-30)

* **fix:** Improve file extension resolution by falling back to `fileName` when `mimeType` is insufficient.
* **style:** Move renderer styles from inline props to `styles.css`.
