import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

/** What an item of a menu can ask of the menu that holds it: to close (a split button gives it, as it owns its state). */
export const PopupMenuContext = createContext<{ close: () => void }>({ close: () => undefined });

interface PopupMenuProps {
    id?: string;
    /** What the list is for, for assistive technology */
    label: string;
    children: ReactNode;
}

/** The admin's popup menu (`ui/component/multilevel_popup_menu`): a list of actions in one group, drawn under what opened it. */
export function PopupMenu({ id, label, children }: PopupMenuProps): React.ReactElement {
    return (
        <div id={id} role="group" aria-label={label} className="ibexa-popup-menu ibexa-multilevel-popup-menu__branch">
            <div className="ibexa-popup-menu__groups ibexa-multilevel-popup-menu__groups">
                <div className="ibexa-popup-menu__group ibexa-multilevel-popup-menu__group">{children}</div>
            </div>
        </div>
    );
}

interface PopupMenuItemProps {
    children: ReactNode;
    /** A link; without it the item is a button */
    href?: string;
    /** The address is another site or tool: it opens in a new tab */
    external?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

/** An action of a popup menu: choosing it closes the menu. */
export function PopupMenuItem({ children, href, external = false, onClick, disabled }: PopupMenuItemProps): React.ReactElement {
    const { close } = useContext(PopupMenuContext);
    const choose = (): void => {
        onClick?.();
        close();
    };
    const content = <span className="ibexa-btn__label">{children}</span>;
    const className = 'ibexa-popup-menu__item-content ibexa-multilevel-popup-menu__item-content';

    return (
        <div className="ibexa-popup-menu__item ibexa-multilevel-popup-menu__item">
            {href !== undefined ? (
                <a className={className} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} onClick={choose}>{content}</a>
            ) : (
                <button type="button" className={className} disabled={disabled} onClick={choose}>{content}</button>
            )}
        </div>
    );
}
