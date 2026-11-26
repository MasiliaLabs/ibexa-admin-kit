import React, { useEffect, useId, useRef, useState } from 'react';

import { buttonClassName } from './buttons';
import { clockDateFor, fromLocalInput, toLocalInput } from './datetime';
import type { ZoneClock } from './datetime';
import { FieldFrame, describedBy } from './Field';
import { IconSvg } from './IconSvg';

/** What the admin gives its scripts: the date picker (`core/date.time.picker.js`, on flatpickr) and the time zone helper. */
interface IbexaPicker {
    flatpickrInstance: { setDate: (date: Date | null, triggerChange: boolean) => void; destroy: () => void };
    inputField: HTMLInputElement;
    init: () => void;
    clear: () => void;
}
interface IbexaGlobals {
    core?: { DateTimePicker?: new (config: { container: HTMLElement; onChange: (timestamps: Array<number | ''>) => void }) => IbexaPicker };
    helpers?: { timezone?: { convertDateToTimezone: (date: Date, timezone: string) => ZoneClock } };
    adminUiConfig?: { timezone: string };
}
const admin = (): IbexaGlobals | undefined => (window as unknown as { ibexa?: IbexaGlobals }).ibexa;

interface DateTimeFieldProps {
    label: string;
    /** The moment, in seconds since 1970 (what a server keeps); null for none */
    value: number | null;
    onChange: (value: number | null) => void;
    /** The names of the two buttons of the field, for assistive technology */
    labels: { calendar: string; clear: string };
    placeholder?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

/**
 * A date and a time, as the admin's forms draw them: its own picker (`ibexa.core.DateTimePicker`), which shows the clock of the admin's time
 * zone and gives the moment back in seconds. The admin's script writes into the input and opens the calendar, so React leaves the input
 * alone; without that script (a page that does not load the admin's) the browser's own date and time field is used.
 */
export function DateTimeField({ label, value, onChange, labels, placeholder, hint, error, disabled, required }: DateTimeFieldProps): React.ReactElement {
    const id = useId();
    const container = useRef<HTMLDivElement>(null);
    const picker = useRef<IbexaPicker | null>(null);
    const [native] = useState(() => admin()?.core?.DateTimePicker === undefined);
    const latest = useRef(onChange);
    latest.current = onChange;

    useEffect(() => {
        const Picker = admin()?.core?.DateTimePicker;
        if (native || Picker === undefined || container.current === null) {
            return undefined;
        }
        const instance = new Picker({ container: container.current, onChange: (timestamps) => latest.current(typeof timestamps[0] === 'number' ? timestamps[0] : null) });
        instance.init();
        picker.current = instance;

        return () => {
            instance.flatpickrInstance.destroy();
            picker.current = null;
        };
    }, [native]);

    // the value the page gives, shown without telling the page about it (it already knows)
    useEffect(() => {
        const instance = picker.current;
        const ibexa = admin();
        if (instance === null || ibexa?.helpers?.timezone === undefined || ibexa.adminUiConfig === undefined) {
            return;
        }
        const shown = instance.inputField.dataset.timestamp ?? '';
        if (shown === (value === null ? '' : String(value))) {
            return;
        }
        const { timezone } = ibexa.adminUiConfig;
        const convert = ibexa.helpers.timezone.convertDateToTimezone;
        instance.flatpickrInstance.setDate(value === null ? null : clockDateFor(value, (date) => convert(date, timezone)), false);
        instance.inputField.dataset.timestamp = value === null ? '' : String(value);
    }, [value]);

    return (
        <FieldFrame id={id} label={label} required={required} hint={hint} error={error}>
            {native ? (
                <input
                    id={id}
                    type="datetime-local"
                    className={`ibexa-input ibexa-input--date form-control${error !== undefined ? ' is-invalid' : ''}`}
                    value={toLocalInput(value)}
                    disabled={disabled}
                    required={required}
                    aria-invalid={error !== undefined}
                    aria-describedby={describedBy(id, hint, error)}
                    onChange={(event) => onChange(fromLocalInput(event.target.value))}
                />
            ) : (
                <div ref={container}>
                    <div className="ibexa-input-text-wrapper ibexa-date-time-picker">
                        <div className="ibexa-input-text-wrapper__input-wrapper">
                            <input
                                id={id}
                                type="text"
                                className={`form-control ibexa-input ibexa-input--date ibexa-date-time-picker__input flatpickr flatpickr-input${error !== undefined ? ' is-invalid' : ''}`}
                                placeholder={placeholder ?? ' '}
                                disabled={disabled}
                                aria-invalid={error !== undefined}
                                aria-describedby={describedBy(id, hint, error)}
                            />
                            <div className="ibexa-input-text-wrapper__actions">
                                <button type="button" className={buttonClassName('ghost', { noText: true, extra: 'ibexa-input-text-wrapper__action-btn ibexa-input-text-wrapper__action-btn--clear' })} tabIndex={-1} aria-label={labels.clear} disabled={disabled} onClick={() => picker.current?.clear()}>
                                    <IconSvg name="discard" size="small" />
                                </button>
                                <button type="button" className={buttonClassName('ghost', { noText: true, extra: 'ibexa-input-text-wrapper__action-btn ibexa-input-text-wrapper__action-btn--calendar' })} aria-label={labels.calendar} disabled={disabled}>
                                    <IconSvg name="date" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </FieldFrame>
    );
}
