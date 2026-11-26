import React from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { buttonClassName } from './buttons';
import type { ButtonVariant } from './buttons';
import { contextSlotId } from './contextSlots';
import { IconSvg } from './IconSvg';

/**
 * Draws its children in a slot of the context menu of the admin: the item of `.ibexa-context-menu`, under `.ibexa-content-menu-wrapper`,
 * that the template of the page draws for the action called `name` (the page template of the kit does, from its `kit_actions`). Where the
 * page has no such slot (a template that was overridden) they stay where they are.
 */
export function ContextSlot({ name, children }: { name: string; children: ReactNode }): React.ReactElement {
    const target = document.getElementById(contextSlotId(name));

    return target === null ? <>{children}</> : createPortal(children, target);
}

interface ContextButtonProps {
    children: ReactNode;
    onClick: () => void;
    variant?: ButtonVariant;
    /** An icon of the admin's sprite, before the label */
    icon?: string;
    disabled?: boolean;
    /** Why it is disabled, or what it does when the label does not say */
    title?: string;
}

/** A button of the context menu, with the markup the admin's own context menu gives its buttons (`btn ibexa-btn …`, `ibexa-btn__label`). */
export function ContextButton({ children, onClick, variant = 'secondary', icon, disabled, title }: ContextButtonProps): React.ReactElement {
    return (
        <button type="button" className={buttonClassName(variant)} disabled={disabled} title={title} onClick={onClick}>
            {icon !== undefined ? <IconSvg name={icon} /> : null}
            <span className="ibexa-btn__label">{children}</span>
        </button>
    );
}
