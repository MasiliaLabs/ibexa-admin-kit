import assert from 'node:assert/strict';
import { test } from 'node:test';

import { clockDateFor, fromLocalInput, toLocalInput } from './datetime';

test('the picker shows the clock of the zone: an instant at 10:00 UTC reads 12:00 in a zone two hours ahead', () => {
    const plusTwo = (date: Date) => {
        const shifted = new Date(date.getTime() + 2 * 3600 * 1000);

        return { year: () => shifted.getUTCFullYear(), month: () => shifted.getUTCMonth(), date: () => shifted.getUTCDate(), hours: () => shifted.getUTCHours(), minutes: () => shifted.getUTCMinutes(), seconds: () => shifted.getUTCSeconds() };
    };
    const instant = Date.UTC(2026, 10, 26, 10, 0, 0) / 1000;

    const shown = clockDateFor(instant, plusTwo);

    assert.deepEqual([shown.getFullYear(), shown.getMonth(), shown.getDate(), shown.getHours(), shown.getMinutes()], [2026, 10, 26, 12, 0], 'a date of the browser zone with the clock of the admin zone');
});

test('a day that changes with the zone is the day of the zone', () => {
    const plusTwo = (date: Date) => {
        const shifted = new Date(date.getTime() + 2 * 3600 * 1000);

        return { year: () => shifted.getUTCFullYear(), month: () => shifted.getUTCMonth(), date: () => shifted.getUTCDate(), hours: () => shifted.getUTCHours(), minutes: () => shifted.getUTCMinutes(), seconds: () => shifted.getUTCSeconds() };
    };

    const shown = clockDateFor(Date.UTC(2026, 10, 26, 23, 30, 0) / 1000, plusTwo);

    assert.deepEqual([shown.getDate(), shown.getHours(), shown.getMinutes()], [27, 1, 30]);
});

test('the fallback input round-trips an instant on the clock of the browser, and says nothing for no date', () => {
    const instant = Math.floor(new Date(2026, 10, 26, 9, 5, 0).getTime() / 1000);

    assert.equal(toLocalInput(instant), '2026-11-26T09:05');
    assert.equal(fromLocalInput('2026-11-26T09:05'), instant);
    assert.equal(toLocalInput(null), '');
    assert.equal(fromLocalInput(''), null);
    assert.equal(fromLocalInput('not a date'), null);
});
