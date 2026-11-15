import React, { useId } from 'react';

import { FieldFrame, describedBy } from './Field';

interface CheckboxFieldProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    hint?: string;
    disabled?: boolean;
}

/** A checkbox with its label, in the admin's markup (`ibexa-input--checkbox`), and an optional hint under it. */
export function CheckboxField({ label, checked, onChange, hint, disabled }: CheckboxFieldProps): React.ReactElement {
    const id = useId();

    return (
        <div className="ibexa-field-edit masilia-kit-field masilia-kit-check">
            <div className="form-check">
                <input
                    id={id}
                    type="checkbox"
                    className="ibexa-input ibexa-input--checkbox form-check-input"
                    checked={checked}
                    disabled={disabled}
                    aria-describedby={describedBy(id, hint)}
                    onChange={(event) => onChange(event.target.checked)}
                />
                <label className="ibexa-label form-check-label" htmlFor={id}>{label}</label>
            </div>
            {hint !== undefined ? <div className="ibexa-form-help"><div className="ibexa-form-help__content" id={`${id}-hint`}>{hint}</div></div> : null}
        </div>
    );
}

export interface CheckboxChoice {
    value: string;
    label: string;
    /** A word shown after the label (for example "current") */
    note?: string;
}

interface CheckboxGroupProps {
    label: string;
    choices: CheckboxChoice[];
    selected: string[];
    onChange: (selected: string[]) => void;
    hint?: string;
    error?: string;
}

/** A group of checkboxes under one label: a set of values among a list. */
export function CheckboxGroup({ label, choices, selected, onChange, hint, error }: CheckboxGroupProps): React.ReactElement {
    const id = useId();

    return (
        <FieldFrame id={id} group label={label} hint={hint} error={error}>
            <div className="masilia-kit-check-group">
                {choices.map((choice) => (
                    <CheckboxField
                        key={choice.value}
                        label={choice.note === undefined ? choice.label : `${choice.label} (${choice.note})`}
                        checked={selected.includes(choice.value)}
                        onChange={(checked) => onChange(checked ? [...selected, choice.value] : selected.filter((value) => value !== choice.value))}
                    />
                ))}
            </div>
        </FieldFrame>
    );
}
