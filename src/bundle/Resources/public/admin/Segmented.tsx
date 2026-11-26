import React, { useId } from 'react';

import { FieldFrame } from './Field';

export interface SegmentedOption<T extends string> {
    value: T;
    label: string;
    /** The longer explanation, as a tooltip (the admin's own: it is the `title`) */
    title?: string;
}

interface SegmentedFieldProps<T extends string> {
    label: string;
    value: T;
    options: SegmentedOption<T>[];
    onChange: (value: T) => void;
    disabled?: boolean;
    error?: string;
    hint?: string;
    /** The label is for assistive technology only (a toolbar says what its buttons are by itself) */
    hideLabel?: boolean;
}

/**
 * A few choices side by side, one picked: radio buttons drawn as one segmented button, the chosen one in the colour of the admin's primary
 * action. The field frame is the admin's (the label names the group; an error and a hint come below), and the arrow keys move the choice, as
 * on any group of radio buttons.
 */
export function SegmentedField<T extends string>({ label, value, options, onChange, disabled, error, hint, hideLabel }: SegmentedFieldProps<T>): React.ReactElement {
    const id = useId();

    return (
        <FieldFrame id={id} label={label} group labelHidden={hideLabel} error={error} hint={hint}>
            <div className="masilia-kit-seg">
                {options.map((option) => (
                    <label key={option.value} className={`masilia-kit-seg__item${value === option.value ? ' is-active' : ''}${disabled === true ? ' is-disabled' : ''}`} title={option.title}>
                        <input type="radio" name={id} value={option.value} checked={value === option.value} disabled={disabled} onChange={() => onChange(option.value)} />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
        </FieldFrame>
    );
}
