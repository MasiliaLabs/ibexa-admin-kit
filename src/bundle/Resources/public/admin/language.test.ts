import assert from 'node:assert/strict';
import { test } from 'node:test';

import { languageLabel } from './language';

test('a language is named in the language of the admin, with its code', () => {
    assert.equal(languageLabel('fr', 'en'), 'French (fr)');
    assert.equal(languageLabel('fr', 'fr'), 'français (fr)');
});

test('a code the runtime does not know stays as it is', () => {
    assert.equal(languageLabel('not a language code', 'en'), 'not a language code');
});

test('without a page the locale is English', () => {
    assert.equal(languageLabel('ar'), 'Arabic (ar)');
});
