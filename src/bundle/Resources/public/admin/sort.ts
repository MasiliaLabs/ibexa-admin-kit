/** The sort of a table: which column, which way. Pure, so it is tested without a page. A click on a header goes ascending, descending, then back to no sort (the order the rows came in); another column starts ascending. */

export type SortDirection = 'asc' | 'desc';

export interface SortState {
    key: string;
    direction: SortDirection;
}

export function nextSort(current: SortState | null, key: string): SortState | null {
    if (current === null || current.key !== key) {
        return { key, direction: 'asc' };
    }

    return current.direction === 'asc' ? { key, direction: 'desc' } : null;
}

/** The modifier of the header's text wrapper (`ibexa-table__sort-column--asc|desc`): the admin's arrow follows it. */
export function sortClass(state: SortState | null, key: string): string {
    return state !== null && state.key === key ? ` ibexa-table__sort-column--${state.direction}` : '';
}

export function ariaSort(state: SortState | null, key: string): 'ascending' | 'descending' | 'none' {
    return state === null || state.key !== key ? 'none' : state.direction === 'asc' ? 'ascending' : 'descending';
}

/**
 * The rows in the order of a value, for a table that sorts itself. Stable (rows with the same value keep their order), texts compared as
 * a person reads them (case, accents and numbers inside the text), numbers as numbers.
 */
export function sortRows<T>(rows: readonly T[], value: (row: T) => string | number, direction: SortDirection): T[] {
    const sign = direction === 'asc' ? 1 : -1;

    return rows
        .map((row, position) => ({ row, position, key: value(row) }))
        .sort((a, b) => {
            const order = typeof a.key === 'number' && typeof b.key === 'number'
                ? a.key - b.key
                : String(a.key).localeCompare(String(b.key), undefined, { sensitivity: 'base', numeric: true });

            return order !== 0 ? sign * order : a.position - b.position;
        })
        .map((entry) => entry.row);
}
