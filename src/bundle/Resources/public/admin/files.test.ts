import assert from 'node:assert/strict';
import { test } from 'node:test';

import { downloadFile } from './files';

test('the file is taken through a link that is not left in the page', () => {
    const events: string[] = [];
    const link = { href: '', download: '', click: () => events.push('click'), remove: () => events.push('remove') };
    const page = {
        createElement: () => link as unknown as HTMLAnchorElement,
        body: { appendChild: (node: unknown) => { events.push('append'); return node as Node; } },
    };

    downloadFile('/api/export', 'policy.json', page as never);

    assert.equal(link.href, '/api/export');
    assert.equal(link.download, 'policy.json');
    assert.deepEqual(events, ['append', 'click', 'remove']);
});
