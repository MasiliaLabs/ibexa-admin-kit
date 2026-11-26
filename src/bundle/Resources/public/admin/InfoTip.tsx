import React from 'react';

import { IconSvg } from './IconSvg';

interface InfoTipProps {
    /** The explanation: the tooltip, and the accessible name of the icon */
    text: string;
    /** `false` inside a control (a section header is a button: a control cannot hold another): hover only, the text is part of the name of that control */
    focusable?: boolean;
}

/**
 * A small information icon that explains something in a tooltip, for what would otherwise sit under a name as a line of grey text.
 * The tooltip is the admin's own (`ibexa.helpers.tooltips` turns the `title` of any element into one, those React adds later included):
 * nothing is drawn here. Inside a dialog of the kit the tooltip is placed in the dialog, above it, as the admin does for its modals.
 */
export function InfoTip({ text, focusable = true }: InfoTipProps): React.ReactElement {
    const icon = <IconSvg name="about-info" size="small" />;

    return focusable ? (
        <button type="button" className="masilia-kit-infotip" title={text} aria-label={text} data-tooltip-container-selector=".masilia-kit-dialog">{icon}</button>
    ) : (
        <span className="masilia-kit-infotip" title={text} role="img" aria-label={text} data-tooltip-container-selector=".masilia-kit-dialog">{icon}</span>
    );
}
