/** The buttons of a pagination, made from the pages the admin's own helper computes (`computePages`): pure, so it is tested without a page. */

/** What the admin's helper puts between pages that are not shown */
export const GAP = '...';

export interface PageButton {
    key: string;
    kind: 'prev' | 'next' | 'page' | 'gap';
    /** The index (from 0) the button goes to; null for a gap */
    pageIndex: number | null;
    label: string;
    active: boolean;
    disabled: boolean;
}

/** How many pages `totalCount` items make. */
export function pageCount(totalCount: number, itemsPerPage: number): number {
    return itemsPerPage > 0 ? Math.ceil(totalCount / itemsPerPage) : 0;
}

/** How many items the page shows: the last one may be short. */
export function viewingCount(totalCount: number, itemsPerPage: number, activePageIndex: number): number {
    return Math.max(0, Math.min(itemsPerPage, totalCount - activePageIndex * itemsPerPage));
}

/**
 * The buttons: previous, the pages (the current one is active and cannot be chosen, a gap is not a button that goes anywhere), next.
 * Previous is out of reach on the first page and next on the last; `disabled` puts everything out of reach (a page is loading).
 */
export function pageButtons(pages: ReadonlyArray<number | string>, activePageIndex: number, pagesCount: number, disabled = false): PageButton[] {
    const middle: PageButton[] = pages.map((page, position) => {
        if (page === GAP || typeof page !== 'number') {
            return { key: `gap-${position}`, kind: 'gap', pageIndex: null, label: GAP, active: false, disabled: true };
        }
        const active = page === activePageIndex + 1;

        return { key: `page-${page}`, kind: 'page', pageIndex: page - 1, label: String(page), active, disabled: active || disabled };
    });

    return [
        { key: 'prev', kind: 'prev', pageIndex: activePageIndex - 1, label: '', active: false, disabled: activePageIndex === 0 || disabled },
        ...middle,
        { key: 'next', kind: 'next', pageIndex: activePageIndex + 1, label: '', active: false, disabled: activePageIndex + 1 >= pagesCount || disabled },
    ];
}
