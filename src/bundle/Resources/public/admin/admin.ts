/**
 * What the scripts of the admin share with the page that carries them: the routes the admin exposes to its scripts (FOSJsRouting, the
 * same `Routing` the admin's own scripts call) and the CSRF token of the admin (its CSRF-Token meta tag), which comes back in the
 * X-CSRF-Token header of every write.
 */

interface AdminRouting {
    generate(name: string, parameters?: Record<string, unknown>, absolute?: boolean): string;
}

/** The URL of a route of a bundle, for the siteaccess of the page (the admin's own prefix included). */
export function route(name: string, parameters: Record<string, unknown> = {}): string {
    const routing = (globalThis as { Routing?: AdminRouting }).Routing;
    if (routing === undefined) {
        throw new Error(`The routes of the admin are not loaded: "${name}" cannot be generated.`);
    }

    return routing.generate(name, parameters);
}

/** The CSRF token the admin page was given; empty when there is no page (tests, a page that is not the admin's). */
export function csrfToken(): string {
    if (typeof document === 'undefined') {
        return '';
    }

    return document.querySelector<HTMLMetaElement>('meta[name="CSRF-Token"]')?.content ?? '';
}

/** The one header every request of a script of the admin carries: the token of the page, which the server checks. Nothing about the body (an upload sets its own `Content-Type`, with its boundary). */
export function csrfHeaders(extra: Record<string, string> = {}): Record<string, string> {
    return { 'X-CSRF-Token': csrfToken(), ...extra };
}

/** The headers a request of a script of the admin carries when it speaks JSON both ways: the token of the page, then `Content-Type` and `Accept`. */
export function adminHeaders(extra: Record<string, string> = {}): Record<string, string> {
    return csrfHeaders({ 'Content-Type': 'application/json', Accept: 'application/json', ...extra });
}
