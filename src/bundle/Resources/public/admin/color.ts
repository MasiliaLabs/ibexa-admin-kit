/** A colour as a person types or picks it: pure, so it is tested without a page. */

/** The colour written as #RRGGBB (upper case), or null when the text is not one. A missing "#" is forgiven; the short form "#abc" is not. */
export function parseHex(input: string): string | null {
    const match = /^#?([0-9a-fA-F]{6})$/.exec(input.trim());

    return match === null ? null : `#${match[1].toUpperCase()}`;
}
