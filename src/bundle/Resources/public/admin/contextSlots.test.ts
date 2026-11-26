import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CONTEXT_SLOT_PREFIX, contextSlotId } from './contextSlots';

test('a slot is named after its action, with the prefix the template of the kit gives it', () => {
    assert.equal(CONTEXT_SLOT_PREFIX, 'masilia-kit-context-');
    assert.equal(contextSlotId('save'), 'masilia-kit-context-save');
    assert.equal(contextSlotId('preview'), 'masilia-kit-context-preview');
});
