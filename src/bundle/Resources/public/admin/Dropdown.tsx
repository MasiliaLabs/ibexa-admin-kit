import React, { useId } from 'react';

import { fromId, toId, toItems } from './adapters';
import type { Option } from './adapters';
import { FieldFrame } from './Field';
import { DropdownMultiInput, DropdownSingleInput } from './ids';

interface DropdownFieldProps {
    label: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    /** An entry that stands for "nothing chosen" (its value is the empty string); without it the dropdown must have a value */
    emptyLabel?: string;
    /** What an unchosen required dropdown says */
    placeholder?: string;
    required?: boolean;
    hint?: string;
    error?: string;
    disabled?: boolean;
    hideLabel?: boolean;
}

/** A choice among a list, in the design system's dropdown: a field with its label, hint and error, and a search once the list is long. */
export function DropdownField({ label, value, options, onChange, emptyLabel, placeholder, required, hint, error, disabled, hideLabel }: DropdownFieldProps): React.ReactElement {
    const id = useId();

    return (
        <FieldFrame id={id} group labelHidden={hideLabel} label={label} required={required} hint={hint} error={error}>
                <DropdownSingleInput
                    name={id}
                    items={toItems(options, emptyLabel)}
                    value={toId(value, emptyLabel !== undefined)}
                    onChange={(selected) => onChange(fromId(selected))}
                    disabled={disabled}
                    error={error !== undefined}
                    renderEmptySelectionInfo={placeholder === undefined ? undefined : () => <div className="ids-dropdown__placeholder">{placeholder}</div>}
                />
        </FieldFrame>
    );
}

interface MultiDropdownFieldProps {
    label: string;
    values: string[];
    options: Option[];
    onChange: (values: string[]) => void;
    /** What an empty selection says */
    placeholder?: string;
    required?: boolean;
    hint?: string;
    error?: string;
    disabled?: boolean;
}

/** A choice of several values among a list, in the design system's multiple dropdown (a checkbox per entry, the choices shown as chips). */
export function MultiDropdownField({ label, values, options, onChange, placeholder, required, hint, error, disabled }: MultiDropdownFieldProps): React.ReactElement {
    const id = useId();

    return (
        <FieldFrame id={id} group label={label} required={required} hint={hint} error={error}>
            <DropdownMultiInput
                name={id}
                items={options.map((option) => ({ id: option.value, label: option.label }))}
                value={values}
                onChange={onChange}
                disabled={disabled}
                error={error !== undefined}
                renderEmptySelectionInfo={placeholder === undefined ? undefined : () => <div className="ids-dropdown__placeholder">{placeholder}</div>}
            />
        </FieldFrame>
    );
}
