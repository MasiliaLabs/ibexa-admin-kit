import React, { useId } from 'react';

import { FieldFrame } from './Field';
import { ToggleButtonInput } from './ids';

interface ToggleFieldProps {
    label: string;
    checked: boolean;
    /** Gets the new state */
    onChange: (checked: boolean) => void;
    /** What the switch says in each position, beside it ("On" / "Off") */
    onLabel?: string;
    offLabel?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

/** An on/off switch, the design system's toggle in the frame of the admin's fields. */
export function ToggleField({ label, checked, onChange, onLabel, offLabel, hint, error, disabled, required }: ToggleFieldProps): React.ReactElement {
    const id = useId();

    return (
        <FieldFrame id={id} label={label} required={required} error={error} hint={hint}>
            <ToggleButtonInput id={id} name={id} checked={checked} disabled={disabled} onChange={onChange} onLabel={onLabel} offLabel={offLabel} />
        </FieldFrame>
    );
}
