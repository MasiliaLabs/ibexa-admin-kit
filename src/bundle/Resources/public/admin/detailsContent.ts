/** What the admin's "details" block needs: pure, so it is tested without a page. The rules are those of its template and of `details.js`. */

/** Is the text cut by its box (`ellipsized`): wider or taller than what is shown. The admin's own test. */
export function isOverflowing(box: { offsetWidth: number; scrollWidth: number; offsetHeight: number; scrollHeight: number }): boolean {
    return box.offsetWidth < box.scrollWidth || box.offsetHeight < box.scrollHeight;
}

/** The classes of the content of an item: cut to one line, or to `lines`, until the person asks for more. */
export function contentClassName(ellipsized: boolean, expanded: boolean, lines?: number): string {
    const cut = ellipsized && !expanded;

    return ['ibexa-details__item-content', cut ? 'ibexa-details__item-content--ellipsized' : '', cut && lines !== undefined ? 'ibexa-details__item-content--multi-line-ellipsized' : '']
        .filter((name) => name !== '')
        .join(' ');
}
