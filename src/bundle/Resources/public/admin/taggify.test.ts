import assert from 'node:assert/strict';
import { test } from 'node:test';

import { addTags, DEFAULT_ACCEPT_KEYS, isAcceptKey, matchesPattern, removeTag, splitTags } from './taggify';

test('Enter ends a tag unless the page chose other keys', () => {
    assert.equal(isAcceptKey('Enter', DEFAULT_ACCEPT_KEYS), true);
    assert.equal(isAcceptKey(',', DEFAULT_ACCEPT_KEYS), false);
    assert.equal(isAcceptKey(',', ['Enter', ',']), true);
});

test('a text is cut at the separators, trimmed, and empty tags are dropped', () => {
    assert.deepEqual(splitTags('red, green;blue', ['Enter', ',', ';']), ['red', 'green', 'blue']);
    assert.deepEqual(splitTags(' a ,, b ,', ['Enter', ',']), ['a', 'b']);
});

test('without a separator the whole text is one tag, even with a comma in it', () => {
    assert.deepEqual(splitTags('a, b', DEFAULT_ACCEPT_KEYS), ['a, b']);
    assert.deepEqual(splitTags('   ', DEFAULT_ACCEPT_KEYS), []);
});

test('a tag is added once and keeps its place', () => {
    assert.deepEqual(addTags(['a', 'b'], ['b', 'c', 'c', '']), ['a', 'b', 'c']);
});

test('a tag is removed', () => {
    assert.deepEqual(removeTag(['a', 'b', 'c'], 'b'), ['a', 'c']);
    assert.deepEqual(removeTag(['a'], 'zzz'), ['a']);
});

test('the pattern of the page decides what may become a tag, and a global pattern does not remember its last match', () => {
    assert.equal(matchesPattern('anything', null), true);
    assert.equal(matchesPattern('abc', /^[a-z]+$/), true);
    assert.equal(matchesPattern('ab1', /^[a-z]+$/), false);
    const global = /a/g;
    assert.equal(matchesPattern('a', global), true);
    assert.equal(matchesPattern('a', global), true);
});
