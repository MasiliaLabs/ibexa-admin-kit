/** The selection of the rows of a table, by their keys: pure, so it is tested without a page. The rules are those of the admin's own (`admin.table.js`): the main checkbox is checked when every row that can be chosen is, unchecked when none is, in between otherwise. */

export type SelectionState = 'none' | 'some' | 'all';

/** The state of the main checkbox, over the rows that can be chosen (a row that cannot is left out); with none that can, it is `none`. */
export function selectionState(selected: ReadonlySet<string>, selectable: readonly string[]): SelectionState {
    if (selectable.length === 0) {
        return 'none';
    }
    const chosen = selectable.filter((key) => selected.has(key)).length;

    return chosen === 0 ? 'none' : chosen === selectable.length ? 'all' : 'some';
}

/** One row is chosen when it was not, and not when it was. */
export function toggleOne(selected: ReadonlySet<string>, key: string): Set<string> {
    const next = new Set(selected);
    if (next.has(key)) {
        next.delete(key);
    } else {
        next.add(key);
    }

    return next;
}

/** The main checkbox: when every row that can be chosen is, none is; otherwise all of them are. Rows that cannot be chosen keep their state. */
export function toggleAll(selected: ReadonlySet<string>, selectable: readonly string[]): Set<string> {
    const next = new Set(selected);
    const all = selectionState(selected, selectable) === 'all';
    for (const key of selectable) {
        if (all) {
            next.delete(key);
        } else {
            next.add(key);
        }
    }

    return next;
}

/** What is still chosen after the rows changed (a reload, a filter): the keys that are no longer there are dropped. */
export function prune(selected: ReadonlySet<string>, keys: readonly string[]): Set<string> {
    const present = new Set(keys);

    return new Set([...selected].filter((key) => present.has(key)));
}
