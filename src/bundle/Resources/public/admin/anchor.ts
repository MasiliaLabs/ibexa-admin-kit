/** Which section of a long page the person is reading: pure, so it is tested without a page. The rule is the admin's own (`admin.anchor.navigation.js`). */

export interface SectionBox {
    id: string;
    /** From the top of the viewport (`getBoundingClientRect().top`) */
    top: number;
    height: number;
}

/**
 * The first section that has not scrolled out of sight above `offset` (the line under what stays fixed at the top of the page: its header,
 * plus a margin); past the last section, the last one. No section: nothing.
 */
export function activeSection(boxes: readonly SectionBox[], offset: number): string | null {
    const first = boxes.find((box) => box.top + box.height >= offset);

    return first?.id ?? boxes[boxes.length - 1]?.id ?? null;
}
