import React, { useEffect, useId, useState } from 'react';

import { parseHex } from './color';
import { buttonClassName } from './buttons';
import { FieldFrame } from './Field';
import { Notice } from './Notice';

interface ColorFieldLabels {
    /** The name of the picker of the browser */
    pick: string;
    /** Said when the text typed is not a colour */
    invalid: string;
    /** The button that gives the colour back (to the default of the page) */
    reset: string;
    /** The name of the group of colours to start from */
    swatches: string;
}

interface ColorFieldProps {
    label: string;
    /** #RRGGBB, or empty for the colour the page takes by default */
    value: string;
    onChange: (value: string) => void;
    labels: ColorFieldLabels;
    /** Colours to start from (#RRGGBB) */
    swatches?: readonly string[];
    /** What the page has to say about the colour chosen (it is hard to read on its background): shown under the field, never a reason to refuse it */
    warnings?: string[];
    /** What the picker shows when there is no colour yet */
    fallback?: string;
    error?: string;
    hint?: string;
    disabled?: boolean;
}

/**
 * A colour: the picker of the browser, the #RRGGBB written out (what a server keeps), colours to start from, and a way back to the default.
 * Each change is given at once; a text that is not a colour is said and not given.
 */
export function ColorField({ label, value, onChange, labels, swatches = [], warnings = [], fallback = '#1A56DB', error, hint, disabled }: ColorFieldProps): React.ReactElement {
    const id = useId();
    const valid = parseHex(value);
    const [draft, setDraft] = useState(value);
    // the colour changed by another control (the picker, a swatch, the reset): the text follows
    useEffect(() => setDraft(value), [value]);

    const type = (text: string): void => {
        setDraft(text);
        if (text.trim() === '') {
            onChange('');

            return;
        }
        const hex = parseHex(text);
        if (hex !== null) {
            onChange(hex);
        }
    };
    const mistyped = draft.trim() !== '' && parseHex(draft) === null ? labels.invalid : undefined;

    return (
        <FieldFrame id={id} label={label} group error={error ?? mistyped} hint={hint}>
            <div className="masilia-kit-color">
                <input
                    type="color"
                    className="masilia-kit-color__picker"
                    aria-label={labels.pick}
                    value={(valid ?? fallback).toLowerCase()}
                    disabled={disabled}
                    onChange={(event) => onChange(event.target.value.toUpperCase())}
                />
                <input
                    id={id}
                    className="ibexa-input ibexa-input--text form-control masilia-kit-color__text"
                    value={draft}
                    placeholder={fallback}
                    spellCheck={false}
                    autoComplete="off"
                    disabled={disabled}
                    aria-label={label}
                    aria-invalid={error !== undefined || mistyped !== undefined}
                    onChange={(event) => type(event.target.value)}
                />
                <button type="button" className={buttonClassName('ghost', { size: 'small' })} disabled={disabled === true || value === ''} onClick={() => onChange('')}>{labels.reset}</button>
            </div>
            {swatches.length > 0 ? (
                <div className="masilia-kit-swatches" role="group" aria-label={labels.swatches}>
                    {swatches.map((color) => (
                        <button
                            key={color}
                            type="button"
                            className={`masilia-kit-swatches__item${valid === color ? ' is-active' : ''}`}
                            style={{ background: color }}
                            aria-label={color}
                            title={color}
                            aria-pressed={valid === color}
                            disabled={disabled}
                            onClick={() => onChange(color)}
                        />
                    ))}
                </div>
            ) : null}
            {warnings.map((warning) => <Notice key={warning} role="status">{warning}</Notice>)}
        </FieldFrame>
    );
}
