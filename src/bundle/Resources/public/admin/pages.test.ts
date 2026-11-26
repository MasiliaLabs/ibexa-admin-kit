import assert from 'node:assert/strict';
import { test } from 'node:test';

import { GAP, pageButtons, pageCount, viewingCount } from './pages';

test('the pages are counted by what a page holds, and the last page may be short', () => {
    assert.equal(pageCount(124, 25), 5);
    assert.equal(pageCount(100, 25), 4);
    assert.equal(pageCount(0, 25), 0);
    assert.equal(pageCount(10, 0), 0);
    assert.equal(viewingCount(124, 25, 0), 25);
    assert.equal(viewingCount(124, 25, 4), 24);
    assert.equal(viewingCount(0, 25, 0), 0);
});

test('previous is out of reach on the first page, next on the last', () => {
    const first = pageButtons([1, 2, 3], 0, 3);
    assert.equal(first[0].disabled, true);
    assert.equal(first[first.length - 1].disabled, false);
    assert.equal(first[first.length - 1].pageIndex, 1);

    const last = pageButtons([1, 2, 3], 2, 3);
    assert.equal(last[0].disabled, false);
    assert.equal(last[0].pageIndex, 1);
    assert.equal(last[last.length - 1].disabled, true);
});

test('the current page is active and cannot be chosen again; the others go to their own index', () => {
    const buttons = pageButtons([1, 2, 3], 1, 3).filter((button) => button.kind === 'page');

    assert.deepEqual(buttons.map((button) => [button.label, button.pageIndex, button.active, button.disabled]), [
        ['1', 0, false, false],
        ['2', 1, true, true],
        ['3', 2, false, false],
    ]);
});

test('a gap goes nowhere', () => {
    const gap = pageButtons([1, GAP, 5, 6, 7], 5, 7).find((button) => button.kind === 'gap');

    assert.deepEqual([gap?.pageIndex, gap?.disabled, gap?.label], [null, true, GAP]);
});

test('while a page loads, nothing can be chosen', () => {
    assert.ok(pageButtons([1, 2, 3], 1, 3, true).every((button) => button.disabled));
});
