---
name: masilia-ibexa-admin-kit
description: Build or change React admin pages for Ibexa 5 with masilia/ibexa-admin-kit (the shared components in the look of the Ibexa admin - fields, dropdowns, tabs, tables, dialogs, filter bars, UDW picker). Use whenever the user works on an Ibexa admin page, bundle admin UI, Encore `ibexa` entry, "@masilia-admin-kit" imports, an admin screen that should look like Ibexa's, or mentions masilia/ibexa-admin-kit, even if they do not name the package.
---

# masilia/ibexa-admin-kit

React components with the classes, behaviour and design system of the Ibexa admin, shared by the Masilia admin pages (`ibexa-sites`, `ibexa-ai`) and usable in any Ibexa 5 bundle. It copies nothing from Ibexa: it reuses the global admin CSS classes, `@ids-components` and Ibexa's helpers, so pages follow the admin when it changes.

## Set it up in a project
`react-popper` (imported by the Ibexa design system dropdown, not declared by Ibexa) needs nothing from you: since 0.1.5 the kit aliases it to a stand-in (`shims/react-popper.js`, a `usePopper` on `@popperjs/core`) when the project does not have the real one. With an older kit the build fails with `contains a reference to the file "react-popper"`: update the kit, or `yarn add react-popper @popperjs/core`.
1. `composer require masilia/ibexa-admin-kit`, then enable `Masilia\Bundle\IbexaAdminKit\MasiliaIbexaAdminKitBundle` in `config/bundles.php` (it has no PHP to wire: it only ships `Resources/encore/ibexa.config.setup.js`, which adds the alias `@masilia-admin-kit`).
2. `php bin/console cache:clear` (regenerates `var/encore`), `yarn ibexa-generate-tsconfig` (TypeScript paths), `php bin/console ibexa:encore:compile` (not `yarn encore dev --config-name ibexa`: that config does not exist on a blank project). Inside DDEV prefix with `ddev exec`.

With the Masilia recipes endpoint in the `composer.json` (`https://api.github.com/repos/MasiliaLabs/recipes/contents/index.json?ref=flex/main` in `extra.symfony.endpoint`, after Ibexa's), `composer require` already enables the bundle and writes the route and config files (see the README, section *With Symfony Flex*); then do what is left. Without the endpoint, do everything by hand.

## Use it in an admin page
- Declare the page entries in the bundle's `Resources/encore/ibexa.config.js` (the `ibexa` build), import through the alias: `import { DropdownField } from '@masilia-admin-kit/Dropdown'`. Styles: `@use '@masilia-admin-kit/kit';`.
- Catalogue (look at the files under `src/bundle/Resources/public/admin/` before writing a new one): fields (`Field`: TextField, TextAreaField; `Dropdown`: DropdownField, MultiDropdownField; `Checkbox`; `RadioGroup`; `Toggle`; `Segmented`; `ColorField`; `DateTimeField`; `TaggifyField`; `OrderedChoice`; `InlineInput`; `UdwPicker`), layout (`Tabs`, `Section`, `Table`: TableHeader/DataTable with `selection` and `sort`, `Pagination`, `FilterCard`: FilterSelect/FilterButton, `SearchInput`, `Details`, `AnchorNavigation`, `Layout`: Inline/Muted/FormStack/Toolbar), feedback (`Alert`, `FormError`, `Notice`, `InfoTip`, `StatusTag`, `StatTile`, `Spinner`, `notify`), actions (`LinkButton`, `IconButton`, `ExternalLink`, `Dialog`, `ConfirmDialog`, `Popover`), the context menu (`ContextMenu`: ContextSlot/ContextButton, `SplitButton`, `PopupMenu`), helpers (`http`, `i18n`, `AdminProviders`, `admin`: route/csrfToken/csrfHeaders (the token alone: use it for an upload, `adminHeaders` adds a JSON `Content-Type`), `language`, `files`, `udw`, `adapters`, `useDebounced`).
- **No `ibexa-*` class written by hand in a package.** An alert, a link that looks like a button, an error row, a tooltip, a button of the filter bar… all have a component here: use it. A class that no component carries is a component the kit lacks: add it (see below). Only the very custom styles of a page belong to the package.
- The page itself: extend `@ibexadesign/masilia_kit/page.html.twig` and set `kit_title`, `kit_entry`, `kit_root` (and `kit_container`, `kit_breadcrumbs`, `kit_actions`) outside any block; do not copy the layout, breadcrumbs and entry tags of another page. Buttons of the context menu: `ContextSlot name="save"` + `ContextButton`, with `kit_actions = ['save']` in the template.
- Tooltips are the admin's own: give the element a `title` (as `InfoTip` and the design system's `Button` do). Do not draw one.
- Server calls: use `http` (it sends the admin CSRF token, returns errors as values and problems by field). Do not hand-roll `fetch`.
- Texts: your own translation domain, published with `bazinga_js_translation.active_domains`, with English defaults given to `createTranslator`; dump with `bazinga:js-translation:dump public/assets --merge-domains` and rebuild.

## Rules that save hours
- One React on the page: `window.React`. Mount with `window.ReactDOMClient.createRoot`, never `react-dom/client`; JSX is the classic runtime (`import React from 'react'`). Never put the page in the front-office Encore config.
- The `.tsx` files cannot run under Node: keep logic that needs tests in `.ts` modules, and test with `cd src/bundle/Resources/public/admin && node --experimental-strip-types --import ./test-hooks/register.mjs --test *.test.ts`.
- ts-loader fails the build on a type error: read the Encore output, do not ignore it.
- Browsers cache `/assets/ibexa/build/*.js` without a hash: after a rebuild ask for a hard reload.
- Never type passwords into the admin for the user; they sign in themselves.

- A pure module must not differ from its component by case only (`details.ts` next to `Details.tsx`): esbuild and case-insensitive file systems resolve the import to the component. Name it for what it does (`detailsContent.ts`, `pages.ts`, `contextSlots.ts`).

## When something is missing
Add the component to the kit (not to the page), with its pure logic in a `.ts` file and a test, then follow the `masilia-package-release` skill to release it before dependent packages.
