# Ibexa Admin Kit

[![CI](https://github.com/MasiliaLabs/ibexa-admin-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/MasiliaLabs/ibexa-admin-kit/actions/workflows/ci.yml)
[![Latest version](https://img.shields.io/packagist/v/masilia/ibexa-admin-kit.svg)](https://packagist.org/packages/masilia/ibexa-admin-kit)
[![Downloads](https://img.shields.io/packagist/dt/masilia/ibexa-admin-kit.svg)](https://packagist.org/packages/masilia/ibexa-admin-kit/stats)
[![PHP](https://img.shields.io/packagist/php-v/masilia/ibexa-admin-kit.svg)](https://packagist.org/packages/masilia/ibexa-admin-kit)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

React components in the design of the Ibexa admin, for the admin pages of your bundles.

`masilia/ibexa-admin-kit` is part of a family of packages for [Ibexa](https://www.ibexa.co) that work together or alone. See [the other packages](#the-masilia-packages).

## What it is

The admin pages of the Masilia packages are React applications. This package holds the parts they share, written once, with the look, the classes and the behaviour of the Ibexa admin: fields, dropdowns, tabs, tables, dialogs, filter bars, notices, a content browser picker… You can use them in the admin pages of your own bundles too.

It reuses what Ibexa already has instead of copying it: the global CSS classes of the admin (`ibexa-btn`, `ibexa-table`, `ibexa-tabs`…), the components of the Ibexa Design System (`@ids-components`) and Ibexa's own helpers (notifications, the Universal Discovery Widget, the icon sprite). Nothing of Ibexa is bundled here, so your pages follow the admin when it changes.

## What is in it

| Area | Components and helpers |
| --- | --- |
| Fields | `TextField` (text, number, password, url), `TextAreaField`, `DropdownField` and `MultiDropdownField` (search included), `Checkbox` and `CheckboxGroup`, `RadioGroupField`, `ToggleField`, `SegmentedField`, `ColorField`, `DateTimeField` (the admin's own date picker), `TaggifyField` (tags), `OrderedChoice` (an ordered list), `InlineInput` (a small field for the actions of a header or a row), `UdwPicker` (the content browser) |
| Layout | `Tabs`, `Section` (an accordion section), `TableHeader` (with badges beside the title) and `DataTable` (zebra rows, sticky actions column, empty state, rows that can be chosen, sortable headers), `Pagination`, `FilterCard` with `FilterSelect`, `FilterButton` and `SearchInput` (the adaptive filters bar), `Details`, `AnchorNavigation` and `AnchorSection`, `Inline`, `Muted`, `FormStack`, `Toolbar` |
| Feedback | `Alert` (the admin's alert), `FormError` (the error row of a form), `Notice` (the informative text of a table header), `InfoTip` (an icon with the admin's own tooltip), `CapsTag` (a badge of capitals, such as a language code), `StatusTag`, `StatTile`, `Spinner`, `Autosave`, `notify()` (Ibexa's toast) |
| Actions | `LinkButton` (a link drawn as a button), `IconButton` (with a busy state), `ExternalLink`, `Dialog` and `ConfirmDialog` (focus trap, Escape, side panel or centred), `Popover` (a window next to what it edits) |
| The context menu | `ContextSlot` and `ContextButton` (a button drawn in the context menu of the admin, under `.ibexa-content-menu-wrapper`), `SplitButton` ("Save and close" and its chevron), `PopupMenu` and `PopupMenuItem` |
| Pages | `@ibexadesign/masilia_kit/page.html.twig`: the layout, the breadcrumbs, the title, the root of the React app and its Encore entry, and the items of the context menu (see [Admin pages](#admin-pages)) |
| Helpers | `http` (JSON calls with the admin's CSRF token, errors as values, problems by field), `i18n` (the Bazinga JS translator with English fallbacks), `AdminProviders` (what the design system's components need around them), `route`, `csrfHeaders` (the token alone, for an upload) and `adminHeaders` (the JSON variant), `languageLabel`, `downloadFile`, `udw`, `adapters`, `useDebounced` |

## Requirements

- PHP 8.3 or later
- Ibexa 5.0 (Symfony 7.4)
- Node.js 24 and Yarn, to build the admin assets with the Ibexa Encore setup of your project

## Installation

The dropdown of the Ibexa Design System imports `react-popper`, a package Ibexa does not declare (a project usually has it only because another dependency brings it). The kit takes care of it: its Encore setup aliases `react-popper` to a small stand-in for the one hook the dropdown uses (`usePopper`, on `@popperjs/core`, which Ibexa does declare) **only when the project does not have the real package**. There is nothing to install; a project that has `react-popper` keeps it.

```bash
composer require masilia/ibexa-admin-kit
```

1. Enable the bundle in `config/bundles.php`:

   ```php
   Masilia\Bundle\IbexaAdminKit\MasiliaIbexaAdminKitBundle::class => ['all' => true],
   ```

   The bundle has no PHP to wire. Its job is to ship `Resources/encore/ibexa.config.setup.js`, which Ibexa's Encore setup reads from every enabled bundle to add the alias `@masilia-admin-kit`.

2. Regenerate the Encore configuration and the TypeScript paths, then build the admin assets (Composer's `auto-scripts` of an Ibexa project do the first two):

   ```bash
   php bin/console cache:clear
   yarn ibexa-generate-tsconfig
   php bin/console ibexa:encore:compile
   ```

   Inside DDEV, prefix each command with `ddev exec`. The admin build is `ibexa:encore:compile`: `yarn encore dev --config-name ibexa` does not work ("Configuration with the name ibexa was not found"), and a plain `yarn encore dev` does not build the admin on a project that has not merged the Ibexa configuration into its `webpack.config.js`.

### With Symfony Flex

The Masilia recipes do the first steps for you. Add their endpoint once to the `composer.json` of your project, after the one of Ibexa:

```json
"extra": {
    "symfony": {
        "endpoint": [
            "https://api.github.com/repos/ibexa/recipes/contents/index.json?ref=flex/main",
            "https://api.github.com/repos/MasiliaLabs/recipes/contents/index.json?ref=flex/main",
            "flex://defaults"
        ]
    }
}
```

Then `composer require masilia/ibexa-admin-kit` enables the bundle. What is left is yours: the Encore configuration, the TypeScript paths and the admin build (`php bin/console cache:clear`, `yarn ibexa-generate-tsconfig`, `php bin/console ibexa:encore:compile`). The manual steps above and below stay valid.

## Usage

Declare the entries of your admin page in the `ibexa` Encore configuration of your bundle (`Resources/encore/ibexa.config.js`), as any Ibexa bundle does, then import the components through the alias:

```tsx
import React from 'react';
import { DropdownField } from '@masilia-admin-kit/Dropdown';
import { DataTable, TableHeader } from '@masilia-admin-kit/Table';
import { notify } from '@masilia-admin-kit/notify';

export function Example({ rows }: { rows: Row[] }): React.ReactElement {
    return (
        <>
            <TableHeader headline="Rows" count={rows.length} />
            <DataTable
                label="Rows"
                rows={rows}
                rowKey={(row) => row.id}
                columns={[{ key: 'name', header: 'Name', render: (row) => row.name }]}
                empty={{ info: 'Nothing here yet' }}
            />
        </>
    );
}
```

Styles: `@use '@masilia-admin-kit/kit';` in the SCSS of your page.

Things to know:

- There is **one React** on an admin page: `window.React`, provided by the `ibexa` Encore build. Mount with `window.ReactDOMClient.createRoot`, never with `react-dom/client`. The JSX runtime is the classic one (`import React from 'react'`).
- Components must be built by the **`ibexa`** Encore configuration (the admin's), not by the front-office one.
- Texts come from your own translation domain: publish it with `bazinga_js_translation.active_domains` and give `createTranslator` your English defaults.

## Admin pages

A page of an admin bundle is a Twig template that draws the layout of the admin and a root the React app mounts on. The kit has the skeleton of it: the page extends it and sets a few variables **outside any block**.

```twig
{% extends '@ibexadesign/masilia_kit/page.html.twig' %}

{% trans_default_domain 'my_bundle' %}

{% set kit_title = 'page.title'|trans %}
{% set kit_entry = 'my-bundle-react' %}   {# the Encore entry of the `ibexa` build: its stylesheet and script are ibexa-admin-ui-my-bundle-react-css|js #}
{% set kit_root = { id: 'my-bundle-root', data: { api: path('my_bundle.api') } } %}
{% set kit_container = true %}            {# the container of the admin's lists: their width, margins and card #}
{% set kit_actions = ['save', 'publish'] %} {# the buttons the app draws in the context menu, in order #}
```

| Variable | |
| --- | --- |
| `kit_title` | The title of the page (also its last breadcrumb when `kit_breadcrumbs` is not set) |
| `kit_breadcrumbs` | The breadcrumbs after "Admin": a list of `{ value, url? }` |
| `kit_entry` | The name of the Encore entry |
| `kit_root` | `{ id, data }`: the element the app mounts on and its `data-*` attributes (escaped for you) |
| `kit_container` | `true` to put the app in the container of the admin's lists |
| `kit_body_class` | A class of the body |
| `kit_actions` | The names of the actions the app draws in the context menu. The menu is drawn when there is at least one |

The blocks `kit_before_root` and `kit_after_root` hold what a page needs next to the root. In the app, `ContextSlot` draws a button in the item of an action:

```tsx
import { ContextButton, ContextSlot } from '@masilia-admin-kit/ContextMenu';

<ContextSlot name="save"><ContextButton variant="primary" onClick={save}>Save</ContextButton></ContextSlot>
```

The context menu of the admin builds its "more" menu once, when the page loads and the items are still empty: the items of the skeleton are marked so that the admin never moves them there, and an item with nothing in it takes no room.

## Tests

The logic that does not need a browser is tested with Node's built-in runner, with nothing to install:

```bash
cd src/bundle/Resources/public/admin
node --experimental-strip-types --import ./test-hooks/register.mjs --test *.test.ts
```

The page template is tested with PHPUnit:

```bash
composer install
vendor/bin/phpunit
```

## AI agent skill

This package ships a skill for AI coding agents (Claude Code and other agents that read `SKILL.md` skills): how to install, configure, operate and troubleshoot `masilia/ibexa-admin-kit`. It lives in [`skills/masilia-ibexa-admin-kit`](skills/masilia-ibexa-admin-kit/SKILL.md) and comes with the package.

```bash
# For the project (committed with it): from the installed package
mkdir -p .claude/skills && cp -r vendor/masilia/ibexa-admin-kit/skills/masilia-ibexa-admin-kit .claude/skills/

# For all your projects: global
mkdir -p ~/.claude/skills && cp -r vendor/masilia/ibexa-admin-kit/skills/masilia-ibexa-admin-kit ~/.claude/skills/
```

Restart the agent (or reload its skills) to pick it up. Update the copy after `composer update`.

## The Masilia packages

| Package | What it does |
| --- | --- |
| [`masilia/ibexa-admin-kit`](https://github.com/MasiliaLabs/ibexa-admin-kit) | React components in the design of the Ibexa admin, for admin pages |
| [`masilia/ibexa-sites`](https://github.com/MasiliaLabs/ibexa-sites) | A registry of sites that Ibexa serves without a deploy |
| [`masilia/ibexa-ai`](https://github.com/MasiliaLabs/ibexa-ai) | The AI assistant for Ibexa: capabilities, providers, chat, approval flow |
| [`masilia/ibexa-ai-craft`](https://github.com/MasiliaLabs/ibexa-ai-craft) | The assistant builds sites and pages out of blocks |
| [`masilia/ibexa-ai-editor`](https://github.com/MasiliaLabs/ibexa-ai-editor) | AI suggestions and image generation in the content editing form |
| [`masilia/ibexa-blocks`](https://github.com/MasiliaLabs/ibexa-blocks) | Front-office rendering of pages made of blocks, with themes |
| [`masilia/editorial-toolbox`](https://github.com/MasiliaLabs/editorial-toolbox) | In-context editing toolbar for the front office |

**What requires what** (Composer installs it for you):

- `ibexa-sites` requires `ibexa-admin-kit`
- `ibexa-ai` requires `ibexa-admin-kit`
- `ibexa-ai-editor` requires `ibexa-ai`
- `ibexa-ai-craft` requires `ibexa-ai`, `ibexa-blocks` and `ibexa-sites`
- `ibexa-blocks` and `editorial-toolbox` require none of the others; they are happy to find `ibexa-sites` (and each other) when installed.

## Compatibility

| Package version | PHP | Ibexa |
| --- | --- | --- |
| `latest` | 8.3+ | 5.0 |

## Download

- **Composer** (recommended): `composer require masilia/ibexa-admin-kit` — [ibexa-admin-kit on Packagist](https://packagist.org/packages/masilia/ibexa-admin-kit)
- **Archive** of a release: [GitHub releases](https://github.com/MasiliaLabs/ibexa-admin-kit/releases) (each release lists what changed)
- **Source**: `git clone https://github.com/MasiliaLabs/ibexa-admin-kit.git`
- What changed between versions: [CHANGELOG.md](CHANGELOG.md)

## Stay informed

New versions are announced as **GitHub releases**, with their notes taken from the [CHANGELOG](CHANGELOG.md):

- **On GitHub**: *Watch* this repository, *Custom*, *Releases*, to be notified of each release; or follow the feed `https://github.com/MasiliaLabs/ibexa-admin-kit/releases.atom` in your reader.
- **In your project**: `composer outdated "masilia/*"` lists what is behind. To be told by a pull request, let Dependabot (or Renovate) watch the Masilia packages:

  ```yaml
  # .github/dependabot.yml
  version: 2
  updates:
    - package-ecosystem: composer
      directory: /
      schedule: { interval: weekly }
      allow:
        - dependency-name: "masilia/*"
  ```

- **Before updating**: the CHANGELOG says what changes; a change that breaks something is marked **Breaking** and explained in `UPGRADE.md` when there is one. Before 1.0, a minor version (`0.x`) may contain breaking changes: read the notes of the versions you skip. Security problems are announced as GitHub security advisories (see [SECURITY.md](SECURITY.md)).

## Support, contributing and security

- Questions and bug reports: [GitHub issues](https://github.com/MasiliaLabs/ibexa-admin-kit/issues)
- Pull requests are welcome, see [CONTRIBUTING.md](CONTRIBUTING.md)
- Security problems: please follow [SECURITY.md](SECURITY.md) and do not open a public issue

## License

Released under the [MIT license](LICENSE). Copyright © 2026 MasiliaLabs.

Ibexa itself is distributed under its own licenses (Ibexa OSS: GPL-2.0), which apply to the project that uses this package. This package is an independent project, not affiliated with or endorsed by Ibexa AS; "Ibexa" is a trademark of its owner.
