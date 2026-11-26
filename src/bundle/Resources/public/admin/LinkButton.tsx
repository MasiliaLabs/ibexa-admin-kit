import React from 'react';
import type { ReactNode } from 'react';

import { buttonClassName } from './buttons';
import type { ButtonSize, ButtonVariant } from './buttons';
import { IconSvg } from './IconSvg';

interface LinkButtonProps {
    href: string;
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** An icon of the admin's sprite, before the label */
    icon?: string;
    /** For assistive technology, when the label alone does not say enough (a row action says which row) */
    ariaLabel?: string;
    title?: string;
    /** The address is another site or tool: it opens in a new tab */
    external?: boolean;
}

/**
 * A link that looks like a button, as the admin's pages draw their navigation actions (`<a class="btn ibexa-btn …">`): back to a list,
 * open an editor. The design system's button is a `<button>` and cannot be a link.
 */
export function LinkButton({ href, children, variant = 'secondary', size = 'medium', icon, ariaLabel, title, external = false }: LinkButtonProps): React.ReactElement {
    return (
        <a className={buttonClassName(variant, { size })} href={href} aria-label={ariaLabel} title={title} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
            {icon !== undefined ? <IconSvg name={icon} /> : null}
            <span className="ibexa-btn__label">{children}</span>
        </a>
    );
}
