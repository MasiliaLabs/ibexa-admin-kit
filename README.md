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
| Fields | `TextField` (text, number, password, url), `DropdownField` and `MultiDropdownField` (search included), `Checkbox`, `CheckboxGroup`, `OrderedChoice` (an ordered list: up, down, remove, add) |
| Layout | `Tabs` (the tabs of the admin, with keyboard navigation), `Section` (an accordion section), `TableHeader` and `DataTable` (zebra rows, sticky actions column, empty state), `FilterCard` with `FilterSelect` and `SearchInput` (the adaptive filters bar) |
| Feedback | `Notice` (the informative text of a table header), `StatusTag`, `StatTile`, `Spinner`, `notify()` (Ibexa's toast) |
| Actions | `IconButton` (with a busy state), `ExternalLink`, `Dialog` and `ConfirmDialog` (focus trap, Escape, side panel or centred) |
| Content | `UdwPicker`: choose a location with the Universal Discovery Widget and show its name and path |
| Helpers | `http` (JSON calls with the admin's CSRF token, errors as values, problems by field), `i18n` (the Bazinga JS translator with English fallbacks), `udw`, `adapters`, `useDebounced` |

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

## Tests

The logic that does not need a browser is tested with Node's built-in runner, with nothing to install:

```bash
cd src/bundle/Resources/public/admin
node --experimental-strip-types --import ./test-hooks/register.mjs --test *.test.ts
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

## Support, contributing and security

- Questions and bug reports: [GitHub issues](https://github.com/MasiliaLabs/ibexa-admin-kit/issues)
- Pull requests are welcome, see [CONTRIBUTING.md](CONTRIBUTING.md)
- Security problems: please follow [SECURITY.md](SECURITY.md) and do not open a public issue

## License

Released under the [MIT license](LICENSE). Copyright © 2026 MasiliaLabs.

Ibexa itself is distributed under its own licenses (Ibexa OSS: GPL-2.0), which apply to the project that uses this package. This package is an independent project, not affiliated with or endorsed by Ibexa AS; "Ibexa" is a trademark of its owner.
