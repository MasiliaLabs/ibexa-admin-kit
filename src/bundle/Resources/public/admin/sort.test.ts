import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ariaSort, nextSort, sortClass, sortRows } from './sort';

test('a click on a header goes ascending, descending, then back to no sort', () => {
    const asc = nextSort(null, 'name');
    assert.deepEqual(asc, { key: 'name', direction: 'asc' });
    const desc = nextSort(asc, 'name');
    assert.deepEqual(desc, { key: 'name', direction: 'desc' });
    assert.equal(nextSort(desc, 'name'), null);
});

test('another column starts ascending', () => {
    assert.deepEqual(nextSort({ key: 'name', direction: 'desc' }, 'date'), { key: 'date', direction: 'asc' });
});

test('only the sorted column carries the arrow and says how it is sorted', () => {
    const state = { key: 'name', direction: 'desc' as const };
    assert.equal(sortClass(state, 'name'), ' ibexa-table__sort-column--desc');
    assert.equal(sortClass(state, 'date'), '');
    assert.equal(sortClass(null, 'name'), '');
    assert.equal(ariaSort(state, 'name'), 'descending');
    assert.equal(ariaSort({ key: 'name', direction: 'asc' }, 'name'), 'ascending');
    assert.equal(ariaSort(state, 'date'), 'none');
});

test('rows are sorted as a person reads them, and rows with the same value keep their order', () => {
    const rows = [{ n: 'b2', i: 1 }, { n: 'B10', i: 2 }, { n: 'a', i: 3 }, { n: 'Á', i: 4 }, { n: 'b2', i: 5 }];

    assert.deepEqual(sortRows(rows, (row) => row.n, 'asc').map((row) => row.i), [3, 4, 1, 5, 2], 'a and Á together (accents ignored), b2 before B10 (numbers as numbers), the two b2 in their order');
    assert.deepEqual(sortRows(rows, (row) => row.n, 'desc').map((row) => row.i), [2, 1, 5, 3, 4]);
    assert.deepEqual(sortRows([{ v: 10 }, { v: 9 }, { v: 100 }], (row) => row.v, 'asc').map((row) => row.v), [9, 10, 100], 'numbers as numbers');
});
