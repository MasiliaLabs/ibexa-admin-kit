import React from 'react';
import type { ReactNode } from 'react';

import type { Translate } from './i18n';
import { iconPath } from './icons';
import { AssetsProvider, TranslatorProvider } from './ids';

interface AdminProvidersProps {
    /** The translator of the page: the texts the components of the design system show (their labels, "no results") come from it */
    t: Translate;
    /** A class on the element that holds the page, for the styles that hang on it (none: no extra element) */
    className?: string;
    children: ReactNode;
}

/** What the components of the Ibexa Design System need around them: their texts and the icons of the admin. One per page, around everything it draws. */
export function AdminProviders({ t, className, children }: AdminProvidersProps): React.ReactElement {
    return (
        <TranslatorProvider value={{ trans: (id) => t(id) }}>
            <AssetsProvider value={{ getIconPath: iconPath }}>
                {className !== undefined ? <div className={className}>{children}</div> : children}
            </AssetsProvider>
        </TranslatorProvider>
    );
}
