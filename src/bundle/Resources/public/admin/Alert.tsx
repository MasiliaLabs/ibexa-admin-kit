import React from 'react';
import type { ReactNode } from 'react';

import { buttonClassName } from './buttons';
import { alertClassName, alertIcon, alertRole } from './alerts';
import type { AlertSize, AlertType } from './alerts';
import { IconSvg } from './IconSvg';

interface AlertProps {
    type: AlertType;
    size?: AlertSize;
    /** The message: the main line of the alert */
    title?: ReactNode;
    /** A smaller line beside the title (or under it with `subtitleBelow`) */
    subtitle?: ReactNode;
    subtitleBelow?: boolean;
    /** More to say under the lines: a list of problems, a detail */
    children?: ReactNode;
    /** Buttons or links at the end of the alert */
    actions?: ReactNode;
    /** With it the alert can be closed: the button calls it (the page decides what closing means) */
    onClose?: () => void;
    closeLabel?: string;
    /** `alert` for an error, `status` for the rest, unless the page knows better */
    role?: 'alert' | 'status' | 'note';
    className?: string;
}

/**
 * An alert as the admin draws it (`ui/component/alert/alert.html.twig`): an icon for its type, the message, what goes with it, and a
 * way to close it. The one way to tell the person that something failed, needs attention or went well in the pages of the Masilia packages.
 */
export function Alert({ type, size = 'medium', title, subtitle, subtitleBelow = false, children, actions, onClose, closeLabel = 'Close', role, className = '' }: AlertProps): React.ReactElement {
    return (
        <div className={alertClassName(type, size, onClose !== undefined, className)} role={role ?? alertRole(type)}>
            <div className="ibexa-alert__icon-wrapper">
                <IconSvg name={alertIcon(type)} className="ibexa-alert__icon" />
            </div>
            <div className={`ibexa-alert__content${subtitleBelow ? ' ibexa-alert__content--subtitle-below' : ''}`}>
                {title !== undefined ? <div className="ibexa-alert__title">{title}</div> : null}
                {subtitle !== undefined ? <div className="ibexa-alert__subtitle">{subtitle}</div> : null}
                <div className="ibexa-alert__extra_content">{children}</div>
            </div>
            <div className="ibexa-alert__actions">{actions}</div>
            {onClose !== undefined ? (
                <button type="button" className={buttonClassName(null, { noText: true, extra: 'ibexa-alert__close-btn' })} aria-label={closeLabel} title={closeLabel} onClick={onClose}>
                    <IconSvg name="discard" size="tiny" />
                </button>
            ) : null}
        </div>
    );
}
