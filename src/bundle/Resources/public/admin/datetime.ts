/** Dates as the admin's date field handles them: pure, so it is tested without a page. A moment is a number of seconds since 1970 (what a server keeps); what a person reads is the clock of the admin's time zone. */

/** What the admin's time zone helper gives for an instant: the date and time on the wall of that zone (a moment.js object has these). */
export interface ZoneClock {
    year(): number;
    month(): number;
    date(): number;
    hours(): number;
    minutes(): number;
    seconds(): number;
}

/**
 * The date the picker must show for an instant: the clock of the zone, as a date of the browser's own zone (the picker only knows that
 * one). The other way (what the picker gives back) is done by the admin's picker itself.
 */
export function clockDateFor(seconds: number, toZone: (date: Date) => ZoneClock): Date {
    const clock = toZone(new Date(seconds * 1000));

    return new Date(clock.year(), clock.month(), clock.date(), clock.hours(), clock.minutes(), clock.seconds());
}

const pad = (value: number): string => String(value).padStart(2, '0');

/** The value of an `<input type="datetime-local">` for an instant, on the browser's clock: what the field falls back to without the admin's picker. */
export function toLocalInput(seconds: number | null): string {
    if (seconds === null) {
        return '';
    }
    const date = new Date(seconds * 1000);

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** The instant a `datetime-local` value means on the browser's clock; null for nothing or what is not a date. */
export function fromLocalInput(value: string): number | null {
    if (value === '') {
        return null;
    }
    const time = new Date(value).getTime();

    return Number.isNaN(time) ? null : Math.floor(time / 1000);
}
