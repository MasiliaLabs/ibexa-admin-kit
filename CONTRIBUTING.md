# Contributing to masilia/ibexa-admin-kit

Thank you for taking the time to contribute. Bug reports, ideas and pull requests are welcome.

## Reporting a bug or asking for a feature

Open an [issue](https://github.com/MasiliaLabs/ibexa-admin-kit/issues/new/choose) and fill the template. For a bug, give the versions of the package, PHP and Ibexa, what you did, what you expected and what happened. Security problems go through the [security policy](SECURITY.md), never through a public issue.

## Working on the code

```bash
git clone https://github.com/MasiliaLabs/ibexa-admin-kit.git
cd ibexa-admin-kit
```

Before you open a pull request, run what the continuous integration runs:

```bash
cd src/bundle/Resources/public/admin
node --experimental-strip-types --import ./test-hooks/register.mjs --test *.test.ts
```

The page template (`src/bundle/Resources/views/themes/admin/masilia_kit/page.html.twig`) is tested with PHPUnit: `composer install && vendor/bin/phpunit`.

The scripts of the admin are written in TypeScript. Their tests run with Node 24 as they are, without any package to install: the logic that is tested lives in `.ts` files, the components in `.tsx` files are checked by the build of the project that uses the package. Name the pure module of a component for what it does, not after the component: `details.ts` next to `Details.tsx` collide on a file system that ignores case.

## Pull requests

- Target the `main` branch and keep the change focused on one thing.
- Add or update the tests that cover it.
- Describe what changes for the people who use the package, and update the `CHANGELOG.md` (the `Unreleased` section).
- Commit messages start with `feat:`, `fix:`, `refactor:`, `docs:` or `chore:`.

By contributing you agree that your contribution is released under the [MIT license](LICENSE) of the project.

## Versioning and maintenance

- **Semantic Versioning.** Releases are `MAJOR.MINOR.PATCH`. While the version is `0.x`, a minor version may contain breaking changes; they are always listed under *Changed* with the word **Breaking** in the [CHANGELOG](CHANGELOG.md).
- **What the promise covers.** The contracts (`Masilia\Contracts\…`, `src/contracts`), the configuration of the bundle, the console commands, the routes and the Twig functions are public: they change only in a major version (a minor one before 1.0), after a deprecation when that is possible. Everything else (`src/lib`, `src/bundle` classes, the TypeScript sources) is internal and may change in any release.
- **Deprecations** are announced in the CHANGELOG (*Deprecated*) and in the code (`@deprecated` with the version), and kept for at least one minor version before they are removed.
- **Supported versions.** Fixes go to the latest minor version only (see [SECURITY.md](SECURITY.md)); upgrade to it before reporting a problem.
- **Releasing** (maintainers): the `Unreleased` section of the CHANGELOG becomes the new version with its date, `composer.json` gets the matching `branch-alias`, then an annotated tag is pushed; the *Release* workflow publishes the GitHub release from the CHANGELOG, and Packagist picks the tag up by itself.
