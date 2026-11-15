import assert from 'node:assert/strict';
import { test } from 'node:test';

import { EMPTY_ID, fromId, tagKind, toId, toItems } from './adapters';

const options = [{ value: 'imal', label: 'imal' }, { value: 'fossil_exit', label: 'fossil_exit' }];

test('a dropdown that may stay empty starts with an entry that says so', () => {
    assert.deepEqual(toItems(options, 'None').map((i) => i.id), [EMPTY_ID, 'imal', 'fossil_exit']);
    assert.equal(toItems(options, 'None')[0].label, 'None');
});

test('a required dropdown has no such entry', () => {
    assert.deepEqual(toItems(options).map((i) => i.id), ['imal', 'fossil_exit']);
});

test('the empty value is the empty entry when there is one, and nothing selected when there is not', () => {
    assert.equal(toId('', true), EMPTY_ID);
    assert.equal(toId('', false), '');
    assert.equal(toId('imal', true), 'imal');
    assert.equal(fromId(EMPTY_ID), '');
    assert.equal(fromId('imal'), 'imal');
});

test('a status has a tag of its own colour', () => {
    assert.equal(tagKind('active'), 'success');
    assert.equal(tagKind('draft'), 'warning');
    assert.equal(tagKind('disabled'), 'neutral');
});
