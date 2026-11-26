import assert from 'node:assert/strict';
import { test } from 'node:test';

import { alertClassName, alertIcon, alertRole } from './alerts';

test('each type has the icon the admin gives it', () => {
    assert.equal(alertIcon('info'), 'about');
    assert.equal(alertIcon('error'), 'notice');
    assert.equal(alertIcon('warning'), 'warning');
    assert.equal(alertIcon('success'), 'approved');
});

test('only an error interrupts assistive technology', () => {
    assert.equal(alertRole('error'), 'alert');
    for (const type of ['info', 'warning', 'success'] as const) {
        assert.equal(alertRole(type), 'status');
    }
});

test('the classes are those of the admin template, with no close button unless there is one', () => {
    assert.equal(alertClassName('error'), 'alert ibexa-alert ibexa-alert--error ibexa-alert--medium ibexa-alert--no-close-btn');
    assert.equal(alertClassName('warning', 'small', true), 'alert ibexa-alert ibexa-alert--warning ibexa-alert--small');
    assert.equal(alertClassName('info', 'large', false, 'mine'), 'alert ibexa-alert ibexa-alert--info ibexa-alert--large ibexa-alert--no-close-btn mine');
});
