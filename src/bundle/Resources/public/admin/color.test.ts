import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseHex } from './color';

test('a colour is written as #RRGGBB in upper case, a missing # is forgiven', () => {
    assert.equal(parseHex('#1a56db'), '#1A56DB');
    assert.equal(parseHex('1A56DB'), '#1A56DB');
    assert.equal(parseHex('  #1a56db '), '#1A56DB');
});

test('what is not a six-digit colour is refused, the short form too', () => {
    assert.equal(parseHex('#abc'), null);
    assert.equal(parseHex('#12345'), null);
    assert.equal(parseHex('blue'), null);
    assert.equal(parseHex(''), null);
});
