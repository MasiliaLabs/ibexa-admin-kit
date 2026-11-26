import React, { useId } from 'react';

import { FieldFrame } from './Field';
import { AltRadiosListField } from './ids';

export interface SegmentedOption<T extends string> {
    value: T;
    label: string;
    /** The longer explanation, as a tooltip */
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

/** A few choices side by side, one picked: the design system's alternative radio buttons, in the frame of the admin's fields. */
export function SegmentedField<T extends string>({ label, value, options, onChange, disabled, error, hint, hideLabel }: SegmentedFieldProps<T>): React.ReactElement {
    const id = useId();

    return (
        <FieldFrame id={id} label={label} group labelHidden={hideLabel} error={error} hint={hint}>
            <AltRadiosListField
                id={id}
                name={id}
                items={options.map((option) => ({ id: `${id}-${option.value}`, value: option.value, label: option.label, title: option.title, disabled, error: error !== undefined }))}
                value={value}
                onChange={(next) => onChange(next as T)}
            />
        </FieldFrame>
    );
}
