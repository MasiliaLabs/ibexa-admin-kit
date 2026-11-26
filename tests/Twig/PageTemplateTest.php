<?php

declare(strict_types=1);

namespace Masilia\Bundle\IbexaAdminKit\Tests\Twig;

use PHPUnit\Framework\TestCase;
use Twig\Environment;
use Twig\Loader\ArrayLoader;
use Twig\Loader\ChainLoader;
use Twig\Loader\FilesystemLoader;
use Twig\TwigFilter;
use Twig\TwigFunction;

/**
 * The skeleton of the admin pages of the Masilia packages: what a page sets, and what the layout of the admin gets from it. The layout, the
 * breadcrumbs and the context menu of the admin are replaced by stand-ins that show what they were given.
 */
final class PageTemplateTest extends TestCase
{
    /** The slots the React app draws in: ContextSlot (contextSlots.ts) looks for these ids */
    private const SLOT_PREFIX = 'masilia-kit-context-';

    /** @param array<string, string> $sets the `{% set %}` lines of the page, by what they set */
    private function render(string $sets, string $body = ''): string
    {
        $layout = <<<'TWIG'
            <body class="{% block body_class %}{% endblock %}"><head>{% block stylesheets %}{% endblock %}<title>{% block title %}{% endblock %}</title></head>
            <nav>{% block breadcrumbs %}{% endblock %}</nav>
            <div class="ibexa-content-menu-wrapper">{% block context_menu %}{% endblock %}</div>
            <header>{% block header %}{% endblock %}</header><main>{% block content %}{% endblock %}</main>{% block javascripts %}{% endblock %}</body>
            TWIG;
        $stubs = new ArrayLoader([
            '@ibexadesign/ui/layout.html.twig' => $layout,
            '@ibexadesign/ui/breadcrumbs.html.twig' => '{% for item in items %}[crumb:{{ item.value }}]{% endfor %}',
            '@ibexadesign/ui/page_title.html.twig' => '<h1>{{ title }}</h1>',
            // the component of the admin: the items, then its own "more" item
            '@ibexadesign/ui/component/context_menu/context_menu.html.twig' => '<ul class="ibexa-context-menu">{{ menu_items }}<li class="ibexa-context-menu__item--more"></li></ul>',
            'page' => "{% extends '@ibexadesign/masilia_kit/page.html.twig' %}\n{$sets}\n{$body}",
        ]);
        $views = new FilesystemLoader();
        $views->addPath(dirname(__DIR__, 2) . '/src/bundle/Resources/views/themes/admin', 'ibexadesign');
        $twig = new Environment(new ChainLoader([$stubs, $views]), ['strict_variables' => true]);
        // the filters and functions the admin provides: they show what they were asked
        // "Admin" is translated by the `messages` domain of the admin: the skeleton must ask for that domain, not for the one of the page
        $twig->addFilter(new TwigFilter('trans', static fn (string $text, array $parameters = [], ?string $domain = null): string => $domain === 'messages' && $text === 'breadcrumb.admin' ? 'Admin' : $text));
        $twig->addFilter(new TwigFilter('desc', static fn (string $text): string => $text));
        $twig->addFunction(new TwigFunction('encore_entry_link_tags', static fn (string $entry, ?string $package, string $build): string => sprintf('<link data-entry="%s" data-build="%s">', $entry, $build), ['is_safe' => ['html']]));
        $twig->addFunction(new TwigFunction('encore_entry_script_tags', static fn (string $entry, ?string $package, string $build): string => sprintf('<script data-entry="%s" data-build="%s"></script>', $entry, $build), ['is_safe' => ['html']]));

        return $twig->render('page');
    }

    public function testThePageTitleIsTheTitleOfTheDocumentTheHeaderAndTheLastBreadcrumbAfterAdmin(): void
    {
        $html = $this->render("{% set kit_title = 'Sites' %}{% set kit_root = { id: 'root' } %}");

        self::assertStringContainsString('<title>Sites</title>', $html);
        self::assertStringContainsString('<h1>Sites</h1>', $html);
        self::assertStringContainsString('[crumb:Admin][crumb:Sites]', $html, 'Admin first, then the page');
    }

    public function testBreadcrumbsAfterAdminAreTheOnesThePageGives(): void
    {
        $html = $this->render("{% set kit_title = 'Mattcch' %}{% set kit_breadcrumbs = [{ value: 'Cookies', url: '/consent' }, { value: 'Mattcch' }] %}{% set kit_root = { id: 'root' } %}");

        self::assertStringContainsString('[crumb:Admin][crumb:Cookies][crumb:Mattcch]', $html);
    }

    public function testTheEntryGivesTheStylesheetAndTheScriptOfTheIbexaBuild(): void
    {
        $html = $this->render("{% set kit_title = 'x' %}{% set kit_entry = 'masilia-sites-react' %}{% set kit_root = { id: 'root' } %}");

        self::assertStringContainsString('<link data-entry="ibexa-admin-ui-masilia-sites-react-css" data-build="ibexa">', $html);
        self::assertStringContainsString('<script data-entry="ibexa-admin-ui-masilia-sites-react-js" data-build="ibexa"></script>', $html);
    }

    public function testWithoutAnEntryNoTagIsAsked(): void
    {
        $html = $this->render("{% set kit_title = 'x' %}{% set kit_root = { id: 'root' } %}");

        self::assertStringNotContainsString('data-entry', $html);
    }

    public function testTheRootCarriesItsDataEscapedOnceForAnAttribute(): void
    {
        $json = '{"root":"a \"quoted\" value"}';
        $html = $this->render("{% set kit_title = 'x' %}{% set kit_root = { id: 'masilia-sites-root', data: { api: '/api/sites?a=1&b=2', udw: " . var_export($json, true) . " } } %}");

        $document = new \DOMDocument();
        $document->loadHTML('<!doctype html><meta charset="utf-8">' . $html, LIBXML_NOERROR);
        $root = $document->getElementById('masilia-sites-root');
        self::assertNotNull($root);
        // what a browser reads back is what the page gave: nothing lost, nothing escaped twice
        self::assertSame('/api/sites?a=1&b=2', $root->getAttribute('data-api'));
        self::assertSame($json, $root->getAttribute('data-udw'));
        self::assertStringNotContainsString('&amp;quot;', $html);
    }

    public function testTheContainerOfTheAdminListsIsOptional(): void
    {
        $without = $this->render("{% set kit_title = 'x' %}{% set kit_root = { id: 'root' } %}");
        $with = $this->render("{% set kit_title = 'x' %}{% set kit_container = true %}{% set kit_root = { id: 'root' } %}");

        self::assertStringNotContainsString('ibexa-container', $without);
        self::assertMatchesRegularExpression('#<section class="container ibexa-container">\s*<div\s+id="root"\s*></div>\s*</section>#', $with);
    }

    public function testThePageMayAddToTheRoot(): void
    {
        $html = $this->render(
            "{% set kit_title = 'x' %}{% set kit_root = { id: 'root' } %}",
            '{% block kit_before_root %}<template id="before"></template>{% endblock %}{% block kit_after_root %}<i id="after"></i>{% endblock %}',
        );

        self::assertLessThan(strpos($html, 'id="root"'), strpos($html, 'id="before"'));
        self::assertGreaterThan(strpos($html, 'id="root"'), strpos($html, 'id="after"'));
    }

    public function testWithoutActionsThereIsNoContextMenu(): void
    {
        $html = $this->render("{% set kit_title = 'x' %}{% set kit_root = { id: 'root' } %}");

        self::assertMatchesRegularExpression('#<div class="ibexa-content-menu-wrapper">\s*</div>#', $html);
        self::assertStringNotContainsString(self::SLOT_PREFIX, $html);
    }

    public function testTheActionsAreItemsOfTheContextMenuInTheirOrderAndTheAdminNeverMovesThemToItsMoreMenu(): void
    {
        $html = $this->render("{% set kit_title = 'x' %}{% set kit_root = { id: 'root' } %}{% set kit_actions = ['preview', 'save', 'publish'] %}");

        self::assertMatchesRegularExpression('#<div class="ibexa-content-menu-wrapper">\s*<ul class="ibexa-context-menu">#', $html, 'the items are in the context menu, under the wrapper of the layout');
        foreach (['preview', 'save', 'publish'] as $name) {
            self::assertMatchesRegularExpression(
                sprintf('#<li id="%s%s" class="[^"]*\bibexa-context-menu__item\b[^"]*\bibexa-adaptive-items__item\b[^"]*\bibexa-adaptive-items__item--force-show\b[^"]*"></li>#', self::SLOT_PREFIX, $name),
                $html,
                sprintf('the item of "%s" is an item of the context menu that the admin never moves to its "more" menu', $name),
            );
        }
        preg_match_all('#<li id="(' . self::SLOT_PREFIX . '[a-z]+)"#', $html, $matches);
        self::assertSame([self::SLOT_PREFIX . 'preview', self::SLOT_PREFIX . 'save', self::SLOT_PREFIX . 'publish'], $matches[1]);
    }

    public function testTheSlotsAreEmptyForTheCssThatHidesTheOnesTheAppLeavesEmpty(): void
    {
        $html = $this->render("{% set kit_title = 'x' %}{% set kit_root = { id: 'root' } %}{% set kit_actions = ['save'] %}");

        self::assertStringContainsString('masilia-kit-context-item"></li>', $html, 'the item has nothing in it (not even a space): the app puts the button in it, `:empty` hides it otherwise');
    }
}
