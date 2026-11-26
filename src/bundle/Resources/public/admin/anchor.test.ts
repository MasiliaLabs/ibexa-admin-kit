import assert from 'node:assert/strict';
import { test } from 'node:test';

import { activeSection } from './anchor';

const SECTIONS = [
    { id: 'a', top: -300, height: 200 },
    { id: 'b', top: -100, height: 300 },
    { id: 'c', top: 200, height: 400 },
];

test('the section being read is the first one that has not left the screen above the fixed header', () => {
    assert.equal(activeSection(SECTIONS, 60), 'b', 'a ended above the line (-100), b reaches below it');
    assert.equal(activeSection([{ id: 'a', top: 10, height: 200 }, { id: 'b', top: 210, height: 200 }], 60), 'a');
});

test('past the last section, the last one is the section', () => {
    assert.equal(activeSection([{ id: 'a', top: -900, height: 200 }, { id: 'z', top: -600, height: 300 }], 60), 'z');
});

test('a section that ends exactly on the line still counts', () => {
    assert.equal(activeSection([{ id: 'a', top: -140, height: 200 }, { id: 'b', top: 60, height: 100 }], 60), 'a');
});

test('no section, no active section', () => {
    assert.equal(activeSection([], 60), null);
});
