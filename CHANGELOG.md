# Changelog

All notable changes to `masilia/ibexa-admin-kit` are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/) (before 1.0, a minor version may contain breaking changes).

## [Unreleased]

## [0.2.0] - 2026-11-26

### Added
- `Alert`: the admin's alert (`ui/component/alert`), with an icon per type (info, error, warning, success), a title, a subtitle, more content, actions and a way to close it.
- `LinkButton` (a link that looks like a button), `FormError` and `FormErrorRow` (the admin's error row, with its icon), `FilterButton` (the "Apply" and "Clear" buttons of the filter bar), and `buttonClassName` (the classes of a button of the admin, in one place).
- `InfoTip`: an information icon whose tooltip is the admin's own (the `title` attribute: Ibexa's tooltip helper handles the elements React adds), placed inside a dialog of the kit when it is in one.
- `Inline`, `Muted`, `FormStack`, `Toolbar` and `ToolbarEnd` (`Layout`): the bricks a page composes instead of writing its own classes.
- `TableHeader` takes `tags`: badges beside the title that stay with it when the actions wrap.
- `TextAreaField`, `SegmentedField` (a few choices side by side drawn as one segmented button, the chosen one in the colour of the primary action, in the frame of a field) and `ColorField` (the browser's picker, the #RRGGBB written out, colours to start from, warnings given by the page), with `parseHex`.
- `AdminProviders` (what the design system's components need around them: their texts and the icons of the admin), `languageLabel` (a language named in the language of the admin), `downloadFile`, and `route` (the routes the admin exposes to its scripts).
- `Icon`, `AltRadiosListField`, `RadioButtonsListField`, `ToggleButtonInput` and `Autosave` of the design system, typed.
- `Pagination` (the admin's pagination, with the line that says how many items are shown; it reuses the admin's own `computePages`).
- `DataTable` can choose rows (`selection`: a checkbox per row, a main one with its "some" state, rows that cannot be chosen) and sort (`sort`: sortable headers, `aria-sort`, keyboard), and has icon and centred columns. Without those props it renders exactly what it did.
- `csrfHeaders`: the token of the page and nothing about the body (for an upload, which sets its own `Content-Type`); `adminHeaders` is the JSON variant of it.
- `InlineInput`: a small text field (the admin's small input) with no frame, for the actions of a header or a row ("add a category").
- `TaggifyField` (the admin's tag field, with the rules of its script written for React: tags with a remove button, end keys and separators, a pattern, adding when the field loses the focus) and `DateTimeField` (the admin's own date picker, driven from React: it shows the clock of the admin's time zone and gives the moment back in seconds; the browser's date and time field when the admin's script is not on the page).
- `RadioGroupField` and `ToggleField` (the design system's radio buttons and toggle in the frame of a field), `Details` (the admin's "details" block, a long value can be expanded), `AnchorNavigation` and `AnchorSection` (a long page cut into sections with the admin's anchor menu, the entry of the section being read is lit), and `Autosave` (the design system's, typed).
- The context menu of the admin: `ContextSlot` draws a button in an item of `.ibexa-context-menu` (under `.ibexa-content-menu-wrapper`), `ContextButton` is the button with the markup of the admin's own, `SplitButton` is the admin's split button ("Save and close" and its chevron) and `PopupMenu` / `PopupMenuItem` its menu. `useDismissable` closes a floating element on Escape or a press outside.
- `CapsTag`: a badge whose text is in capitals (a language code). Capitals are centred by the font as they are, so this badge is not raised like the others.
- `Popover`: a window that floats over the page next to what it edits, with an optional header and footer.
- A page template, `@ibexadesign/masilia_kit/page.html.twig`: the layout of the admin, the breadcrumbs, the title, the root of the React app with its `data-*` attributes, its Encore entry and the items of the context menu, set by the page with a few `kit_*` variables. It is tested with PHPUnit (`vendor/bin/phpunit`) and by a CI job.

### Changed
- `TableHeader`: `headline` may be any content, not only a text (the title with its count reads the same).
- The error row of a field has the icon of an error, as the admin's forms draw it.
- `IconSvg` accepts every size of the admin's icon (`tiny` to `extra-large`).
- The actions of a `TableHeader` may wrap onto a second line and lean on the end of the line (`masilia-kit-actions`), for every header, with or without `tags`. It only shows when the actions no longer fit.

### Fixed
- The text of a small badge is centred as the eye sees it. The box of the text was centred, but the font keeps a tall space above lower-case letters, so the body of "write", "yes" or "3 read" sat about a pixel under the middle of the badge. It is raised by 0.08em (1px) for the small badge, the one the pages use; the medium badge, already centred on a 1x screen, is untouched.
- `createTranslator` ignores a global `Translator` that has no `trans` method. Recent browsers have a built-in `Translator` (the translation API): where the admin's own had not replaced it, every text call failed and the page stayed blank.
- `Tabs`: the tabs and their panel are one element (`masilia-kit-tabs`). In a page that lays its content out with a gap (a flex column, as the sites page does) the gap used to open between the active tab and its panel, which the admin draws one pixel overlapping.

## [0.1.6] - 2026-11-20

### Added
- Docs: a *Stay informed* section in the README: how to be told of new releases (GitHub Watch, the releases feed, `composer outdated`, Dependabot) and where to read what changes.

## [0.1.5] - 2026-11-20

### Fixed
- The admin build no longer fails on a project that does not have `react-popper` ("contains a reference to the file react-popper"): the dropdown of the Ibexa Design System imports it and Ibexa does not declare it. The Encore setup aliases `react-popper` to a stand-in for the `usePopper` hook (`shims/react-popper.js`, on `@popperjs/core`) only when the project does not have the real package; nothing to install.

## [0.1.4] - 2026-11-19

### Added
- Docs: a *With Symfony Flex* section in the README and in the skill: the Masilia recipes (`MasiliaLabs/recipes`) enable the bundle and write its route and config files on `composer require`.

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

[Unreleased]: https://github.com/MasiliaLabs/ibexa-admin-kit/compare/0.2.0...HEAD
[0.2.0]: https://github.com/MasiliaLabs/ibexa-admin-kit/compare/0.1.6...0.2.0
[0.1.6]: https://github.com/MasiliaLabs/ibexa-admin-kit/compare/0.1.5...0.1.6
[0.1.5]: https://github.com/MasiliaLabs/ibexa-admin-kit/compare/0.1.4...0.1.5
[0.1.4]: https://github.com/MasiliaLabs/ibexa-admin-kit/compare/0.1.3...0.1.4
[0.1.3]: https://github.com/MasiliaLabs/ibexa-admin-kit/compare/0.1.2...0.1.3
[0.1.2]: https://github.com/MasiliaLabs/ibexa-admin-kit/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/MasiliaLabs/ibexa-admin-kit/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/MasiliaLabs/ibexa-admin-kit/releases/tag/0.1.0
