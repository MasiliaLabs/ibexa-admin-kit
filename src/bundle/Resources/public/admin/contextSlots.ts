/** The places a page keeps in the context menu of the admin: pure, so the page's template and its React app agree on the names and the agreement is tested. */

export const CONTEXT_SLOT_PREFIX = 'masilia-kit-context-';

/** The id of the `<li class="ibexa-context-menu__item">` a page draws for an action called `name` (`save`, `publish`…): the app draws the button in it. */
export function contextSlotId(name: string): string {
    return `${CONTEXT_SLOT_PREFIX}${name}`;
}
