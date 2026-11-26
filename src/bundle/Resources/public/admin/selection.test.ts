import assert from 'node:assert/strict';
import { test } from 'node:test';

import { prune, selectionState, toggleAll, toggleOne } from './selection';

const KEYS = ['a', 'b', 'c'];

test('the main checkbox is all, none, or in between', () => {
    assert.equal(selectionState(new Set(), KEYS), 'none');
    assert.equal(selectionState(new Set(['a']), KEYS), 'some');
    assert.equal(selectionState(new Set(KEYS), KEYS), 'all');
    assert.equal(selectionState(new Set(['zzz']), KEYS), 'none', 'a key that is not a row does not count');
    assert.equal(selectionState(new Set(['a']), []), 'none', 'a table with nothing to choose has nothing chosen');
});

test('a row is chosen, then not', () => {
    const one = toggleOne(new Set(), 'b');
    assert.deepEqual([...one], ['b']);
    assert.deepEqual([...toggleOne(one, 'b')], []);
});

test('the main checkbox chooses all, or none when all were chosen; the rows that cannot be chosen keep their state', () => {
    assert.deepEqual([...toggleAll(new Set(), KEYS)].sort(), KEYS);
    assert.deepEqual([...toggleAll(new Set(['a']), KEYS)].sort(), KEYS, 'in between: all');
    assert.deepEqual([...toggleAll(new Set(KEYS), KEYS)], []);
    // "locked" cannot be chosen: it stays chosen when the others are cleared
    assert.deepEqual([...toggleAll(new Set(['locked', 'a', 'b']), ['a', 'b'])], ['locked']);
});

test('after the rows changed, what is gone is no longer chosen', () => {
    assert.deepEqual([...prune(new Set(['a', 'gone']), ['a', 'b'])], ['a']);
});
