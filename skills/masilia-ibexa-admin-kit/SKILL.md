---
name: masilia-ibexa-admin-kit
description: Build or change React admin pages for Ibexa 5 with masilia/ibexa-admin-kit (the shared components in the look of the Ibexa admin - fields, dropdowns, tabs, tables, dialogs, filter bars, UDW picker). Use whenever the user works on an Ibexa admin page, bundle admin UI, Encore `ibexa` entry, "@masilia-admin-kit" imports, an admin screen that should look like Ibexa's, or mentions masilia/ibexa-admin-kit, even if they do not name the package.
---

# masilia/ibexa-admin-kit

React components with the classes, behaviour and design system of the Ibexa admin, shared by the Masilia admin pages (`ibexa-sites`, `ibexa-ai`) and usable in any Ibexa 5 bundle. It copies nothing from Ibexa: it reuses the global admin CSS classes, `@ids-components` and Ibexa's helpers, so pages follow the admin when it changes.

## Set it up in a project
1. `composer require masilia/ibexa-admin-kit`, then enable `Masilia\Bundle\IbexaAdminKit\MasiliaIbexaAdminKitBundle` in `config/bundles.php` (it has no PHP to wire: it only ships `Resources/encore/ibexa.config.setup.js`, which adds the alias `@masilia-admin-kit`).
2. `php bin/console cache:clear` (regenerates `var/encore`), `yarn ibexa-generate-tsconfig` (TypeScript paths), `php bin/console ibexa:encore:compile` (not `yarn encore dev --config-name ibexa`: that config does not exist on a blank project). Inside DDEV prefix with `ddev exec`.

## Use it in an admin page
- Declare the page entries in the bundle's `Resources/encore/ibexa.config.js` (the `ibexa` build), import through the alias: `import { DropdownField } from '@masilia-admin-kit/Dropdown'`. Styles: `@use '@masilia-admin-kit/kit';`.
- Catalogue (look at the files under `src/bundle/Resources/public/admin/` before writing a new one): fields (`Field`: TextField; `Dropdown`: DropdownField, MultiDropdownField; `Checkbox`; `OrderedChoice`), layout (`Tabs`, `Section`, `Table`: TableHeader/DataTable, `FilterCard`/`FilterSelect`/`SearchInput`), feedback (`Notice`, `StatusTag`, `StatTile`, `Spinner`, `notify`), actions (`IconButton`, `ExternalLink`, `Dialog`, `ConfirmDialog`), content (`UdwPicker`), helpers (`http`, `i18n`, `udw`, `adapters`, `useDebounced`).
- Server calls: use `http` (it sends the admin CSRF token, returns errors as values and problems by field). Do not hand-roll `fetch`.
- Texts: your own translation domain, published with `bazinga_js_translation.active_domains`, with English defaults given to `createTranslator`; dump with `bazinga:js-translation:dump public/assets --merge-domains` and rebuild.

## Rules that save hours
- One React on the page: `window.React`. Mount with `window.ReactDOMClient.createRoot`, never `react-dom/client`; JSX is the classic runtime (`import React from 'react'`). Never put the page in the front-office Encore config.
- The `.tsx` files cannot run under Node: keep logic that needs tests in `.ts` modules, and test with `cd src/bundle/Resources/public/admin && node --experimental-strip-types --import ./test-hooks/register.mjs --test *.test.ts`.
- ts-loader fails the build on a type error: read the Encore output, do not ignore it.
- Browsers cache `/assets/ibexa/build/*.js` without a hash: after a rebuild ask for a hard reload.
- Never type passwords into the admin for the user; they sign in themselves.

## When something is missing
Add the component to the kit (not to the page), with its pure logic in a `.ts` file and a test, then follow the `masilia-package-release` skill to release it before dependent packages.
