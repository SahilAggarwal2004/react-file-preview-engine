# Changelog

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
