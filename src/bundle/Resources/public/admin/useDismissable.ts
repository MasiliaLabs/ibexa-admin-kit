import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * What closes a floating element (a menu, a popover) while it is open: a press outside of `root`, and Escape. The page decides what closing
 * means; `reason` says which of the two it was (after Escape the focus goes back to what opened the element).
 */
export function useDismissable(open: boolean, root: RefObject<HTMLElement | null>, onDismiss: (reason: 'outside' | 'escape') => void): void {
    useEffect(() => {
        if (!open) {
            return undefined;
        }
        const outside = (event: MouseEvent): void => {
            if (root.current !== null && !root.current.contains(event.target as Node)) {
                onDismiss('outside');
            }
        };
        const escape = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                onDismiss('escape');
            }
        };
        document.addEventListener('mousedown', outside);
        document.addEventListener('keydown', escape);

        return () => {
            document.removeEventListener('mousedown', outside);
            document.removeEventListener('keydown', escape);
        };
    }, [open, root, onDismiss]);
}
