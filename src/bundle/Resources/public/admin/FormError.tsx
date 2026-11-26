import React from 'react';
import type { ReactNode } from 'react';

import { IconSvg } from './IconSvg';

/** The row an error is told in, as the admin's forms draw it: the icon of an error, then the message (`<em class="ibexa-form-error__row">`). */
export function FormErrorRow({ id, children }: { id?: string; children: ReactNode }): React.ReactElement {
    return (
        <em className="ibexa-form-error__row" id={id}>
            <IconSvg name="notice" className="ibexa-form-error__icon" />
            {children}
        </em>
    );
}

/** An error that belongs to a group of controls rather than to one field (a list that has no entry, a block that cannot be saved). */
export function FormError({ children }: { children: ReactNode }): React.ReactElement {
    return (
        <div className="ibexa-form-error" role="alert">
            <FormErrorRow>{children}</FormErrorRow>
        </div>
    );
}
