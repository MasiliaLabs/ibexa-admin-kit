/** What the alert component needs, made from its props: pure, so it is tested without a page. The names are those of Ibexa's alert (`ui/component/alert/alert.html.twig`). */

export type AlertType = 'info' | 'error' | 'warning' | 'success';
export type AlertSize = 'small' | 'medium' | 'large';

/** The icon of each type, by the names Ibexa's own alert asks the icon helper for (it resolves the aliases). */
const ICONS: Record<AlertType, string> = {
    info: 'about',
    error: 'notice',
    warning: 'warning',
    success: 'approved',
};

export function alertIcon(type: AlertType): string {
    return ICONS[type];
}

/** What assistive technology is told: an error interrupts (`alert`), the rest informs (`status`). */
export function alertRole(type: AlertType): 'alert' | 'status' {
    return type === 'error' ? 'alert' : 'status';
}

/** The classes of the alert, in the order of the admin's template; without a way to close it, the grid has no room for the button. */
export function alertClassName(type: AlertType, size: AlertSize = 'medium', closable = false, extra = ''): string {
    return ['alert', 'ibexa-alert', `ibexa-alert--${type}`, `ibexa-alert--${size}`, closable ? '' : 'ibexa-alert--no-close-btn', extra]
        .filter((name) => name !== '')
        .join(' ');
}
