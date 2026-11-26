import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buttonClassName } from './buttons';

test('a button has the classes of the admin, in the order of its templates', () => {
    assert.equal(buttonClassName('primary'), 'btn ibexa-btn ibexa-btn--primary');
    assert.equal(buttonClassName('secondary', { size: 'small' }), 'btn ibexa-btn ibexa-btn--secondary ibexa-btn--small');
    assert.equal(buttonClassName('ghost', { noText: true }), 'btn ibexa-btn ibexa-btn--ghost ibexa-btn--no-text');
});

test('a button without a variant takes none, and the extra classes come last', () => {
    assert.equal(buttonClassName(null, { noText: true, extra: 'ibexa-alert__close-btn' }), 'btn ibexa-btn ibexa-btn--no-text ibexa-alert__close-btn');
});
