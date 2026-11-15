import React from 'react';
import type { ReactNode } from 'react';

import type { Option } from './adapters';
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
 * design): a card, the search on the left, the filters beside it, every control on the bottom edge of the row.
 */
export function FilterCard({ search, children, actions }: FilterCardProps): React.ReactElement {
    return (
        <div className="ibexa-adaptive-filters" role="search">
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
    /** The entry that stands for "no filter" ("All") */
    emptyLabel: string;
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
