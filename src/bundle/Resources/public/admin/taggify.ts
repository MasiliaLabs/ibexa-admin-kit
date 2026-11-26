/** What the admin's tag field (`ibexa-taggify`) does with what is typed: pure, so it is tested without a page. The rules are those of its script (`core/taggify.js`). */

/** The keys that end a tag: "Enter" by default. A key of one character ("," or ";") is also a separator inside a text that is typed or pasted. */
export const DEFAULT_ACCEPT_KEYS: readonly string[] = ['Enter'];

export function isAcceptKey(key: string, acceptKeys: readonly string[]): boolean {
    return acceptKeys.includes(key);
}

/** The tags a text holds: cut at the separators, trimmed, empty ones dropped. With no separator the whole text is one tag. */
export function splitTags(text: string, acceptKeys: readonly string[] = DEFAULT_ACCEPT_KEYS): string[] {
    const separators = acceptKeys.filter((key) => key.length === 1);
    const parts = separators.length === 0 ? [text] : text.split(new RegExp(`[${separators.map((key) => `\\${key}`).join('')}]`));

    return parts.map((part) => part.trim()).filter((part) => part !== '');
}

/** The tags after adding some: the ones already there, then the new ones, each once. */
export function addTags(existing: readonly string[], incoming: readonly string[]): string[] {
    const result = [...existing];
    for (const tag of incoming) {
        if (tag !== '' && !result.includes(tag)) {
            result.push(tag);
        }
    }

    return result;
}

export function removeTag(tags: readonly string[], tag: string): string[] {
    return tags.filter((candidate) => candidate !== tag);
}

/** Does what is typed look like a tag (the page's pattern)? With no pattern anything does. */
export function matchesPattern(text: string, pattern: RegExp | null | undefined): boolean {
    if (pattern === null || pattern === undefined) {
        return true;
    }
    pattern.lastIndex = 0;

    return pattern.test(text);
}
