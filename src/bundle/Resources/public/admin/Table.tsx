import React, { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { Notice } from './Notice';
import { selectionState, toggleAll, toggleOne } from './selection';
import { ariaSort, nextSort, sortClass } from './sort';
import type { SortState } from './sort';

export interface Column<T> {
    key: string;
    header: ReactNode;
    render: (row: T) => ReactNode;
    /** The cell holds action buttons (they stay in view on a narrow screen and are laid out in a row) */
    actions?: boolean;
    /** The header can be clicked to sort by this column (the page keeps the sort: see `sort` of the table) */
    sortable?: boolean;
    /** The cell holds an icon (a narrow column, the next one comes close to it) */
    icon?: boolean;
    /** The content of the cell is centred */
    center?: boolean;
}

/** What makes the rows of a table choosable: a checkbox per row, and one in the header for all of them. */
export interface TableSelection<T> {
    /** The keys (`rowKey`) of the rows chosen */
    selected: ReadonlySet<string>;
    onChange: (selected: Set<string>) => void;
    /** The name of the checkbox of a row, for assistive technology ("Select Mattcch") */
    rowLabel: (row: T) => string;
    /** The name of the checkbox of the header ("Select all") */
    allLabel: string;
    /** A row that cannot be chosen (a role that is in use) */
    disabled?: (row: T) => boolean;
}

/** How the table is sorted, and what a click on a sortable header asks for: the rows are the page's to sort (it may be the server's job). */
export interface TableSort {
    state: SortState | null;
    onChange: (state: SortState | null) => void;
}

interface TableHeaderProps {
    /** The title: a text, or what a title can hold (the name of a page and its status) */
    headline: ReactNode;
    /** The count shown in the headline in brackets: "Links (124)" */
    count?: number;
    /** Badges beside the title (a status, a version): they stay with it when the actions wrap */
    tags?: ReactNode;
    actions?: ReactNode;
    /** An informative line under the title, in the headline (as the admin's table header does) */
    notice?: ReactNode;
    /** No rule under the header: it opens a block of fields rather than a table */
    plain?: boolean;
}

/** The title of a table with its count, and the actions that go with it on the right, over a thin rule. */
export function TableHeader({ headline, count, tags, actions, notice, plain }: TableHeaderProps): React.ReactElement {
    const title = count === undefined ? headline : <>{headline} ({count})</>;

    return (
        <div className={`ibexa-table-header${plain === true ? ' masilia-kit-table-header--plain' : ''}`}>
            <div className="ibexa-table-header__headline">
                {tags === undefined ? title : <span className="masilia-kit-inline">{title}{tags}</span>}
                {notice !== undefined ? <Notice>{notice}</Notice> : null}
            </div>
            <div className="ibexa-table-header__actions masilia-kit-actions">{actions}</div>
        </div>
    );
}

interface DataTableProps<T> {
    columns: Column<T>[];
    rows: readonly T[];
    rowKey: (row: T) => string;
    /** What the table says when there is nothing to show, and what could be done about it */
    empty: { info: string; action?: ReactNode };
    /** The name of the table for assistive technology (the title above it) */
    label?: string;
    /** With it the rows can be chosen (bulk actions are buttons of the table header, out of reach until something is chosen) */
    selection?: TableSelection<T>;
    sort?: TableSort;
}

/** The checkbox of the admin's tables (the main one of the header carries its own "some" state). */
function TableCheckbox({ checked, indeterminate = false, disabled, label, className = '', onChange }: { checked: boolean; indeterminate?: boolean; disabled?: boolean; label: string; className?: string; onChange: () => void }): React.ReactElement {
    const input = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (input.current !== null) {
            input.current.indeterminate = indeterminate;
        }
    });

    return <input ref={input} type="checkbox" className={`ibexa-input ibexa-input--checkbox ${className}`.trim()} checked={checked} disabled={disabled} aria-label={label} onChange={onChange} />;
}

/**
 * The admin's table: rows alternate in colour, the head is quiet, and an empty table shows its picture and says why. With `selection` the
 * rows can be chosen, with `sort` the sortable headers can be clicked.
 */
export function DataTable<T>({ columns, rows, rowKey, empty, label, selection, sort }: DataTableProps<T>): React.ReactElement {
    const lastIsActions = columns.length > 0 && columns[columns.length - 1].actions === true;
    const keys = rows.map(rowKey);
    const selectable = selection === undefined ? [] : rows.filter((row) => selection.disabled?.(row) !== true).map(rowKey);
    const state = selection === undefined ? 'none' : selectionState(selection.selected, selectable);
    const columnCount = columns.length + (selection !== undefined ? 1 : 0);
    // the column after a checkbox or an icon comes close to it
    const closeLeft = (index: number): boolean => (index === 0 ? selection !== undefined : columns[index - 1].icon === true);

    return (
        <div className="ibexa-scrollable-wrapper">
            <table aria-label={label} className={`ibexa-table table${lastIsActions ? ' ibexa-table--last-column-sticky' : ''}`}>
                <thead hidden={rows.length === 0}>
                    <tr className="ibexa-table__head-row">
                        {selection !== undefined ? (
                            <th className="ibexa-table__header-cell ibexa-table__header-cell--checkbox" scope="col">
                                <div className="ibexa-table__header-cell-checkbox-wrapper">
                                    <TableCheckbox
                                        className="ibexa-table__header-cell-checkbox ibexa-table__header-cell-checkbox--custom-init"
                                        checked={state === 'all'}
                                        indeterminate={state === 'some'}
                                        disabled={selectable.length === 0}
                                        label={selection.allLabel}
                                        onChange={() => selection.onChange(toggleAll(selection.selected, selectable))}
                                    />
                                </div>
                            </th>
                        ) : null}
                        {columns.map((column, index) => {
                            const sorted = column.sortable === true && sort !== undefined;
                            const toggle = (): void => sort?.onChange(nextSort(sort.state, column.key));

                            return (
                                <th
                                    className={`ibexa-table__header-cell${column.icon === true ? ' ibexa-table__header-cell--has-icon' : ''}${closeLeft(index) ? ' ibexa-table__header-cell--close-left' : ''}${column.center === true ? ' ibexa-table__header-cell--content-center' : ''}`}
                                    scope="col"
                                    key={column.key}
                                    aria-sort={sorted ? ariaSort(sort.state, column.key) : undefined}
                                >
                                    <span
                                        className={`ibexa-table__header-cell-text-wrapper${sorted ? ` ibexa-table__sort-column${sortClass(sort.state, column.key)}` : ''}`}
                                        role={sorted ? 'button' : undefined}
                                        tabIndex={sorted ? 0 : undefined}
                                        onClick={sorted ? toggle : undefined}
                                        onKeyDown={sorted ? (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); } } : undefined}
                                    >
                                        {column.header}
                                    </span>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody className="ibexa-table__body">
                    {rows.length === 0 ? (
                        <tr className="ibexa-table__row">
                            <td className="ibexa-table__empty-table-cell" colSpan={columnCount}>
                                <img className="ibexa-table__empty-table-image" src="/bundles/ibexaadminui/img/ibexa-empty-table.svg" alt="" />
                                <div className="ibexa-table__empty-table-text">
                                    <div className="ibexa-table__empty-table-info-text">{empty.info}</div>
                                    {empty.action !== undefined ? <div className="ibexa-table__empty-table-action-text">{empty.action}</div> : null}
                                </div>
                            </td>
                        </tr>
                    ) : rows.map((row, position) => {
                        const key = keys[position];
                        const chosen = selection?.selected.has(key) === true;

                        return (
                            <tr className={`ibexa-table__row${chosen ? ' ibexa-table__row--selected' : ''}`} key={key}>
                                {selection !== undefined ? (
                                    <td className="ibexa-table__cell ibexa-table__cell--has-checkbox">
                                        <TableCheckbox checked={chosen} disabled={selection.disabled?.(row) === true} label={selection.rowLabel(row)} onChange={() => selection.onChange(toggleOne(selection.selected, key))} />
                                    </td>
                                ) : null}
                                {columns.map((column, index) => (
                                    <td
                                        className={`ibexa-table__cell${column.actions === true ? ' ibexa-table__cell--has-action-btns' : ''}${column.icon === true ? ' ibexa-table__cell--has-icon' : ''}${closeLeft(index) ? ' ibexa-table__cell--close-left' : ''}`}
                                        key={column.key}
                                    >
                                        {column.actions === true
                                            ? <div className="ibexa-table__cell-btns-wrapper">{column.render(row)}</div>
                                            : column.center === true ? <div className="ibexa-table__cell-center-wrapper">{column.render(row)}</div> : column.render(row)}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
