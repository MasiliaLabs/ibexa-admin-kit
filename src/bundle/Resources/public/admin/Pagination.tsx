import React from 'react';

import * as paginationHelper from '@ibexa-admin-ui-helpers/pagination.helper';
import { GAP, pageButtons, pageCount, viewingCount } from './pages';

// The admin's own computation of the pages to show ("1 … 5 6 7 … 10"): reused, not copied.
const computePages = (paginationHelper as unknown as { computePages: (params: { proximity: number; activePageIndex: number; pagesCount: number; separator: string }) => Array<number | string> }).computePages;

interface PaginationProps {
    totalCount: number;
    itemsPerPage: number;
    /** The page shown, from 0 */
    activePageIndex: number;
    onPageChange: (pageIndex: number) => void;
    /** How many pages are shown on each side of the current one */
    proximity?: number;
    /** A page is loading: nothing can be chosen */
    disabled?: boolean;
    /** The line on the left ("Viewing 25 out of 124 items"): the page's own text, in its language */
    info?: (viewingCount: number, totalCount: number) => string;
    previousLabel?: string;
    nextLabel?: string;
}

/**
 * The pagination of the admin's lists (`ibexa-pagination`, the markup and classes of its React pagination), with the line that says how many
 * items are shown. With one page there is nothing to choose: only the line.
 */
export function Pagination({ totalCount, itemsPerPage, activePageIndex, onPageChange, proximity = 2, disabled = false, info, previousLabel = 'Previous', nextLabel = 'Next' }: PaginationProps): React.ReactElement | null {
    if (totalCount === 0) {
        return null;
    }
    const pagesCount = pageCount(totalCount, itemsPerPage);
    const buttons = pagesCount > 1
        ? pageButtons(computePages({ proximity, activePageIndex, pagesCount, separator: GAP }), activePageIndex, pagesCount, disabled)
        : [];

    return (
        <div className="ibexa-pagination">
            {info !== undefined ? <div className="ibexa-pagination__info">{info(viewingCount(totalCount, itemsPerPage, activePageIndex), totalCount)}</div> : null}
            {buttons.length > 0 ? (
                <ul className="c-pagination pagination ibexa-pagination__navigation">
                    {buttons.map((button) => (
                        <li key={button.key} className={`c-pagination-button page-item${button.kind === 'prev' || button.kind === 'next' ? ` ${button.kind}` : ''}${button.active ? ' active' : ''}${button.disabled ? ' disabled' : ''}`}>
                            <button
                                type="button"
                                className="page-link"
                                aria-label={button.kind === 'prev' ? previousLabel : button.kind === 'next' ? nextLabel : undefined}
                                aria-current={button.active ? 'page' : undefined}
                                onClick={() => { if (!button.disabled && button.pageIndex !== null) { onPageChange(button.pageIndex); } }}
                            >
                                {button.label}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
