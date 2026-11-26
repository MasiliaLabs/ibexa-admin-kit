import React from 'react';
import type { ReactNode } from 'react';

import type { Option } from './adapters';
import { buttonClassName } from './buttons';
import { DropdownField } from './Dropdown';

interface FilterCardProps {
    /** The search field: it has the zone on the left, closed by a rule */
    search?: ReactNode;
    /** The filters (`FilterSelect`…), side by side */
    children?: ReactNode;
    /** What the bar does with them, at its end (a button): the admin's "Apply" place */
    actions?: ReactNode;
}

/**
 * The filter bar of the admin's lists (the markup and the classes of Ibexa's `adaptive_filters` component, which carry all of its
 * design, in its "inside tabs" form: flush with the panel of the tab it sits in): a card, the search on the left, the filters beside it, every control on the bottom edge of the row.
 */
export function FilterCard({ search, children, actions }: FilterCardProps): React.ReactElement {
    return (
        <div className="ibexa-adaptive-filters ibexa-adaptive-filters--inside-tabs" role="search">
            <div className="ibexa-adaptive-filters__visible">
                {search !== undefined ? <div className="ibexa-adaptive-filters__static-left"><div className="form-group">{search}</div></div> : null}
                <div className="ibexa-adaptive-filters__items ibexa-adaptive-filters__items--after-initialization">{children}{actions !== undefined ? <div className="ibexa-adaptive-filters__actions">{actions}</div> : null}</div>
            </div>
        </div>
    );
}

interface FilterSelectProps {
    label: string;
    value: string;
    options: Option[];
    /** The entry that stands for "no filter" ("All"); without it the filter always has a value */
    emptyLabel?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

/** A filter that is a choice: its label above, the design system's dropdown below. */
export function FilterSelect({ label, value, options, emptyLabel, onChange, disabled }: FilterSelectProps): React.ReactElement {
    return (
        <div className="ibexa-adaptive-filters__item masilia-kit-filter-select">
            <DropdownField label={label} value={value} options={options} emptyLabel={emptyLabel} onChange={onChange} disabled={disabled} />
        </div>
    );
}

interface FilterButtonProps {
    children: ReactNode;
    onClick?: () => void;
    /** `submit` is the bar's main action ("Apply", "Save", "Add"); `clear` takes the filters back (it is a ghost button in the admin) */
    kind?: 'submit' | 'clear';
    /** The admin's "Apply" is secondary; the one main action of a page's bar may be primary */
    variant?: 'primary' | 'secondary';
    /** A real submit of the form the bar belongs to */
    submit?: boolean;
    disabled?: boolean;
    title?: string;
}

/** A button of the filter bar, at its end (`ibexa-adaptive-filters__submit-btn` / `__clear-btn`): its height and place are the bar's. */
export function FilterButton({ children, onClick, kind = 'submit', variant = 'secondary', submit = false, disabled, title }: FilterButtonProps): React.ReactElement {
    const className = kind === 'clear'
        ? buttonClassName('ghost', { extra: 'ibexa-adaptive-filters__clear-btn' })
        : buttonClassName(variant, { extra: 'ibexa-adaptive-filters__submit-btn' });

    return <button type={submit ? 'submit' : 'button'} className={className} disabled={disabled} title={title} onClick={onClick}>{children}</button>;
}
