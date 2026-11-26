import React from 'react';

import { buttonClassName } from './buttons';
import { IconSvg } from './IconSvg';

interface IconButtonProps {
    icon: string;
    /** What the button does: its tooltip and its name for assistive technology */
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    /** The action is running: the icon turns and the button is out of reach until it ends */
    busy?: boolean;
}

/** A ghost button with an icon and no text, as the tables of the admin have for their actions. */
export function IconButton({ icon, label, onClick, disabled, busy }: IconButtonProps): React.ReactElement {
    const className = buttonClassName('ghost', { noText: true });
    const content = <span className={busy === true ? 'masilia-kit-spin' : undefined} style={{ display: 'inline-flex' }}><IconSvg name={icon} /></span>;

    return <button type="button" className={className} title={label} aria-label={label} disabled={disabled === true || busy === true} aria-busy={busy === true ? true : undefined} onClick={onClick}>{content}</button>;
}
