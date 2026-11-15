import React from 'react';
import type { ReactNode } from 'react';

import { IconSvg } from './IconSvg';

interface NoticeProps {
    children: ReactNode;
    /** An icon of the admin's sprite; the information icon by default */
    icon?: string;
    /** `status` for a text that changes while the person is on the page, `note` otherwise */
    role?: 'note' | 'status';
}

/**
 * An informative text: the notice of the admin's table header (`ibexa-table-header__notice`, same markup as its Twig component),
 * a small grey line led by an icon. The one way to say something informative in the pages of the Masilia packages.
 */
export function Notice({ children, icon = 'about-info', role = 'note' }: NoticeProps): React.ReactElement {
    return (
        <div className="ibexa-table-header__notice masilia-kit-notice" role={role}>
            <IconSvg name={icon} className="ibexa-table-header__notice-icon" />
            {children}
        </div>
    );
}
