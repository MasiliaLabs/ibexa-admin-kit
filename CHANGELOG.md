# Changelog

All notable changes to `masilia/ibexa-admin-kit` are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/) (before 1.0, a minor version may contain breaking changes).

## [Unreleased]

## [0.1.3] - 2026-11-19

### Fixed
- Install docs: the admin is built with `php bin/console ibexa:encore:compile` (`yarn encore dev --config-name ibexa` does not exist on a blank project); README and skill corrected.

## [0.1.2] - 2026-11-19

### Added
- An agent skill, `skills/masilia-ibexa-admin-kit`, for AI coding agents that work with the package; the README says how to install it.

## [0.1.1] - 2026-11-17

### Added
- `Notice`, the informative text of the admin's table header, as a component.
- `IconButton` busy state: the icon turns and the button is disabled while an action runs.
- `warningFor` in `http`: a problem can be a warning, which does not stop a value from being saved.

### Changed
- `notify()` goes through Ibexa's `ibexa.helpers.notification` and falls back to the `ibexa-notify` event.
- Examples and test fixtures are neutral (no project names).

## [0.1.0] - 2026-11-15

First release: the React components of the Masilia admin pages in the design of the Ibexa admin.

### Added
- Fields: `TextField`, `DropdownField`, `MultiDropdownField` (with search), `Checkbox`, `CheckboxGroup`, `OrderedChoice`.
- Layout: `Tabs`, `Section`, `TableHeader` (including a plain variant without a rule), `DataTable`, `FilterCard` with `FilterSelect` and `SearchInput`.
- Feedback and actions: `StatusTag`, `StatTile`, `Spinner`, `Dialog`, `ConfirmDialog`, `ExternalLink`, `IconButton`, `UdwPicker`.
- Helpers: `http`, `i18n`, `notify`, `udw`, `adapters`, `useDebounced`.
- The bundle that registers the `@masilia-admin-kit` alias in Ibexa's Encore configuration.

[Unreleased]: https://github.com/MasiliaLabs/ibexa-admin-kit/compare/0.1.3...HEAD
[0.1.3]: https://github.com/MasiliaLabs/ibexa-admin-kit/compare/0.1.2...0.1.3
[0.1.2]: https://github.com/MasiliaLabs/ibexa-admin-kit/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/MasiliaLabs/ibexa-admin-kit/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/MasiliaLabs/ibexa-admin-kit/releases/tag/0.1.0
