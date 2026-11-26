import React, { useId } from 'react';
import type { ReactNode } from 'react';

import { FormErrorRow } from './FormError';

interface FieldFrameProps {
    id: string;
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    /** The control is several controls (buttons, a list): the label names the group instead of pointing at one of them */
    group?: boolean;
    /** The label is for assistive technology only (the control says what it is by itself) */
    labelHidden?: boolean;
    children: ReactNode;
}

/** A field as the admin forms draw it: a label, the control, what is wrong with it, then a hint. */
export function FieldFrame({ id, label, required, hint, error, group, labelHidden, children }: FieldFrameProps): React.ReactElement {
    return (
        <div className={`ibexa-field-edit masilia-kit-field${labelHidden === true ? ' masilia-kit-field--label-hidden' : ''}`}>
            {group === true ? (
                <span className="ibexa-label" id={`${id}-label`}>
                    {label}
                    {required === true ? <span className="masilia-kit-required" aria-hidden="true"> *</span> : null}
                </span>
            ) : (
                <label className="ibexa-label" htmlFor={id}>
                    {label}
                    {required === true ? <span className="masilia-kit-required" aria-hidden="true"> *</span> : null}
                </label>
            )}
            {group === true ? <div role="group" aria-labelledby={`${id}-label`} aria-describedby={describedBy(id, hint, error)}>{children}</div> : children}
            <div className="ibexa-form-error" aria-live="polite">
                {error !== undefined ? <FormErrorRow id={`${id}-error`}>{error}</FormErrorRow> : null}
            </div>
            {hint !== undefined ? (
                <div className="ibexa-form-help">
                    <div className="ibexa-form-help__content" id={`${id}-hint`}>{hint}</div>
                </div>
            ) : null}
        </div>
    );
}

/** What describes a control to assistive technology: its error, then its hint. */
export function describedBy(id: string, hint?: string, error?: string): string | undefined {
    const ids = [error !== undefined ? `${id}-error` : '', hint !== undefined ? `${id}-hint` : ''].filter((value) => value !== '');

    return ids.length > 0 ? ids.join(' ') : undefined;
}

interface TextFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: 'text' | 'number' | 'password' | 'url';
    required?: boolean;
    hint?: string;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    autoFocus?: boolean;
    inputMode?: 'text' | 'numeric' | 'url';
    autoComplete?: string;
    /** For a number: the step and the bounds */
    step?: string;
    min?: string;
    max?: string;
    onBlur?: () => void;
}

export function TextField({ label, value, onChange, type = 'text', required, hint, error, placeholder, disabled, readOnly, autoFocus, inputMode, autoComplete, step, min, max, onBlur }: TextFieldProps): React.ReactElement {
    const id = useId();

    return (
        <FieldFrame id={id} label={label} required={required} hint={hint} error={error}>
            <div className="ibexa-input-text-wrapper">
                <input
                    id={id}
                    className={`ibexa-input ibexa-input--text form-control${error !== undefined ? ' is-invalid' : ''}`}
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    inputMode={inputMode}
                    autoComplete={autoComplete}
                    step={step}
                    min={min}
                    max={max}
                    data-autofocus={autoFocus === true ? '' : undefined}
                    aria-invalid={error !== undefined}
                    aria-required={required}
                    aria-describedby={describedBy(id, hint, error)}
                    onChange={(event) => onChange(event.target.value)}
                    onBlur={onBlur}
                />
            </div>
        </FieldFrame>
    );
}

interface TextAreaFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    hint?: string;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    rows?: number;
    onBlur?: () => void;
}

/** A text over several lines, as the forms of the admin draw it: the same frame as `TextField`, the admin's textarea. */
export function TextAreaField({ label, value, onChange, required, hint, error, placeholder, disabled, readOnly, rows = 3, onBlur }: TextAreaFieldProps): React.ReactElement {
    const id = useId();

    return (
        <FieldFrame id={id} label={label} required={required} hint={hint} error={error}>
            <textarea
                id={id}
                className={`ibexa-input ibexa-input--textarea form-control${error !== undefined ? ' is-invalid' : ''}`}
                rows={rows}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                aria-invalid={error !== undefined}
                aria-describedby={describedBy(id, hint, error)}
                onChange={(event) => onChange(event.target.value)}
                onBlur={onBlur}
            />
        </FieldFrame>
    );
}
