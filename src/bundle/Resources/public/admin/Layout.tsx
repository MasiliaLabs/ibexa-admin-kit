import React from 'react';
import type { ReactNode } from 'react';

/** Things side by side that wrap when they do not fit, vertically centred, with a gap: a name and its badges, an address and its language. */
export function Inline({ children }: { children: ReactNode }): React.ReactElement {
    return <span className="masilia-kit-inline">{children}</span>;
}

/** A quiet text: the grey, small line the admin uses for what only complements a name (an identifier, a count). */
export function Muted({ children }: { children: ReactNode }): React.ReactElement {
    return <span className="masilia-kit-muted">{children}</span>;
}

/** The fields of a page under one another, with the admin's gap, no wider than a form should be (`wide`: the width of the page). */
export function FormStack({ children, wide = false }: { children: ReactNode; wide?: boolean }): React.ReactElement {
    return <div className={`masilia-kit-form${wide ? ' masilia-kit-form--wide' : ''}`}>{children}</div>;
}

/** The choices that act on what is below (a language, a view), in one row on the bottom edge of their fields, closed by a rule. */
export function Toolbar({ children }: { children: ReactNode }): React.ReactElement {
    return <div className="masilia-kit-toolbar">{children}</div>;
}

/** What leads away from the choices of a toolbar, at the end of its line (a settings button). */
export function ToolbarEnd({ children }: { children: ReactNode }): React.ReactElement {
    return <div className="masilia-kit-toolbar__end">{children}</div>;
}
