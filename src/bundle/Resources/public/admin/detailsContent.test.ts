import assert from 'node:assert/strict';
import { test } from 'node:test';

import { contentClassName, isOverflowing } from './detailsContent';

test('a text is cut when its box is narrower or lower than the text', () => {
    assert.equal(isOverflowing({ offsetWidth: 100, scrollWidth: 240, offsetHeight: 20, scrollHeight: 20 }), true);
    assert.equal(isOverflowing({ offsetWidth: 100, scrollWidth: 100, offsetHeight: 20, scrollHeight: 60 }), true);
    assert.equal(isOverflowing({ offsetWidth: 100, scrollWidth: 100, offsetHeight: 20, scrollHeight: 20 }), false);
});

test('the content is cut to one line, or to several, until it is expanded', () => {
    assert.equal(contentClassName(false, false), 'ibexa-details__item-content');
    assert.equal(contentClassName(true, false), 'ibexa-details__item-content ibexa-details__item-content--ellipsized');
    assert.equal(contentClassName(true, false, 3), 'ibexa-details__item-content ibexa-details__item-content--ellipsized ibexa-details__item-content--multi-line-ellipsized');
    assert.equal(contentClassName(true, true, 3), 'ibexa-details__item-content');
});
