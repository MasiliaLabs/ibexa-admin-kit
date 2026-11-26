import React, { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { IconButton } from './IconButton';

interface PopoverProps {
    /** What the window is, for assistive technology (and its title when it has a header) */
    label: string;
    onClose: () => void;
    /** With a title the window has a header with a button that closes it; `closeLabel` is that button's name */
    title?: string;
    closeLabel?: string;
    /** Actions at the end of the window (a "Done" button) */
    footer?: ReactNode;
    /** Where it sits: the window is absolute, in the nearest positioned ancestor, and the page says where (`left`, `top`, `insetInlineEnd`…) */
    style?: CSSProperties;
    /** Classes of the page for its placement (the window above what it points at…) */
    className?: string;
    id?: string;
    /** Enter closes it, as Escape does, when it is pressed in a one-line field (what is typed is already given) */
    closeOnEnter?: boolean;
    /** The first control takes the focus when the window opens, and again when this changes (another text is edited in the same window) */
    focusKey?: string;
    children: ReactNode;
}

/**
 * A window that floats over the page next to what it edits and leaves the rest free: a body of controls, an optional header and footer.
 * Escape closes it (and nothing else listens to that Escape); the focus goes to its first control when it opens.
 */
export function Popover({ label, onClose, title, closeLabel = 'Close', footer, style, className = '', id, closeOnEnter = false, focusKey = '', children }: PopoverProps): React.ReactElement {
    const body = useRef<HTMLDivElement>(null);
    useEffect(() => {
        body.current?.querySelector<HTMLElement>('input:checked, input:not([type="hidden"]), textarea, select, button')?.focus();
    }, [focusKey]);

    return (
        <div
            id={id}
            className={`masilia-kit-popover ${className}`.trim()}
            role="dialog"
            aria-label={label}
            style={style}
            onKeyDown={(event) => {
                if (event.key === 'Escape' || (closeOnEnter && event.key === 'Enter' && (event.target as HTMLElement).tagName === 'INPUT')) {
                    event.stopPropagation();
                    onClose();
                }
            }}
        >
            {title !== undefined ? (
                <header className="masilia-kit-popover__header">
                    <strong>{title}</strong>
                    <IconButton icon="discard" label={closeLabel} onClick={onClose} />
                </header>
            ) : null}
            <div className="masilia-kit-popover__body" ref={body}>{children}</div>
            {footer !== undefined ? <div className="masilia-kit-popover__footer">{footer}</div> : null}
        </div>
    );
}
