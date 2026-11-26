import React, { useId } from 'react';

import { FieldFrame } from './Field';
import { RadioButtonsListField } from './ids';

export interface RadioOption {
    value: string;
    label: string;
}

interface RadioGroupFieldProps {
    label: string;
    value: string;
    options: RadioOption[];
    onChange: (value: string) => void;
    direction?: 'horizontal' | 'vertical';
    required?: boolean;
    hint?: string;
    error?: string;
    disabled?: boolean;
}

/** One choice among a few, the radio buttons of the design system in the frame of the admin's fields (the label names the group, the error and the hint come below). */
export function RadioGroupField({ label, value, options, onChange, direction = 'vertical', required, hint, error, disabled }: RadioGroupFieldProps): React.ReactElement {
    const id = useId();

    return (
        <FieldFrame id={id} label={label} group required={required} error={error} hint={hint}>
            <RadioButtonsListField
                id={id}
                name={id}
                direction={direction}
                items={options.map((option) => ({ key: `${id}-${option.value}`, id: `${id}-${option.value}`, value: option.value, label: option.label, disabled, error: error !== undefined }))}
                value={value}
                onChange={onChange}
            />
        </FieldFrame>
    );
}
