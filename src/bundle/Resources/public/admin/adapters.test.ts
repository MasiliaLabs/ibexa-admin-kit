import assert from 'node:assert/strict';
import { test } from 'node:test';

import { EMPTY_ID, fromId, tagKind, toId, toItems } from './adapters';

const options = [{ value: 'brand', label: 'brand' }, { value: 'acme', label: 'acme' }];

test('a dropdown that may stay empty starts with an entry that says so', () => {
    assert.deepEqual(toItems(options, 'None').map((i) => i.id), [EMPTY_ID, 'brand', 'acme']);
    assert.equal(toItems(options, 'None')[0].label, 'None');
});

test('a required dropdown has no such entry', () => {
    assert.deepEqual(toItems(options).map((i) => i.id), ['brand', 'acme']);
});

test('the empty value is the empty entry when there is one, and nothing selected when there is not', () => {
    assert.equal(toId('', true), EMPTY_ID);
    assert.equal(toId('', false), '');
    assert.equal(toId('brand', true), 'brand');
    assert.equal(fromId(EMPTY_ID), '');
    assert.equal(fromId('brand'), 'brand');
});

test('a status has a tag of its own colour', () => {
    assert.equal(tagKind('active'), 'success');
    assert.equal(tagKind('draft'), 'warning');
    assert.equal(tagKind('disabled'), 'neutral');
});
