import React, { useCallback, useId, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { buttonClassName } from './buttons';
import { IconSvg } from './IconSvg';
import { PopupMenu, PopupMenuContext } from './PopupMenu';
import { useDismissable } from './useDismissable';

interface SplitButtonProps {
    /** What the main button says */
    label: ReactNode;
    /** What the main button does */
    onClick: () => void;
    /** What the chevron is for: its name and the name of the list it opens */
    menuLabel: string;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    /** The other actions: `PopupMenuItem`s */
    children: ReactNode;
}

/**
 * The admin's split button (`ui/component/split_btn`, "Save and close" and its chevron): a main action, and a chevron that opens the others.
 * The admin's own script runs once when the page loads, on the buttons that exist then: this one is driven here (Escape and a press
 * outside close it, and so does tabbing out of it or choosing an action).
 */
export function SplitButton({ label, onClick, menuLabel, variant = 'secondary', disabled, children }: SplitButtonProps): React.ReactElement {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const menuId = useId();
    const close = useCallback(() => setOpen(false), []);
    const dismiss = useCallback((reason: 'outside' | 'escape') => {
        setOpen(false);
        if (reason === 'escape') {
            root.current?.querySelector<HTMLElement>('.ibexa-split-btn__toggle-btn')?.focus();
        }
    }, []);
    useDismissable(open, root, dismiss);
    const context = useMemo(() => ({ close }), [close]);

    return (
        <div
            ref={root}
            className={`ibexa-split-btn ibexa-split-btn--${variant} masilia-kit-split`}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    close();
                }
            }}
        >
            <button type="button" className={`${buttonClassName(variant)} ibexa-split-btn__main-btn`} disabled={disabled} onClick={onClick}>
                <span className="ibexa-btn__label">{label}</span>
            </button>
            <div className="ibexa-split-btn__split" />
            <button
                type="button"
                className={`${buttonClassName(variant, { noText: true })} ibexa-split-btn__toggle-btn${open ? ' ibexa-split-btn__toggle-btn--subitems-opened' : ''}`}
                aria-label={menuLabel}
                aria-expanded={open}
                aria-controls={menuId}
                disabled={disabled}
                onClick={() => setOpen((value) => !value)}
            >
                <IconSvg name="arrow-chevron-down" className="ibexa-split-btn__toggler-icon" />
            </button>
            {open ? <PopupMenuContext.Provider value={context}><PopupMenu id={menuId} label={menuLabel}>{children}</PopupMenu></PopupMenuContext.Provider> : null}
        </div>
    );
}
