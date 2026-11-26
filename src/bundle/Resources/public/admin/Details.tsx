import React, { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { buttonClassName } from './buttons';
import { contentClassName, isOverflowing } from './detailsContent';
import { IconSvg } from './IconSvg';
import { TableHeader } from './Table';

export interface DetailsItem {
    key: string;
    label: ReactNode;
    content: ReactNode;
    /** The content is cut to one line (or to `lines`), with a button that shows the rest when it is cut */
    ellipsized?: boolean;
    lines?: number;
    className?: string;
}

interface DetailsProps {
    items: DetailsItem[];
    headline?: ReactNode;
    /** Buttons at the end of the headline */
    actions?: ReactNode;
    /** The label above its content (the default is beside it, in a row) */
    vertical?: boolean;
    smallHeadline?: boolean;
    showMoreLabel?: string;
    showLessLabel?: string;
}

function DetailsRow({ item, showMoreLabel, showLessLabel }: { item: DetailsItem; showMoreLabel: string; showLessLabel: string }): React.ReactElement {
    const content = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [overflowing, setOverflowing] = useState(false);
    const ellipsized = item.ellipsized === true;
    // the button is there only when the text is cut: measured while it is cut, kept once it is expanded
    useLayoutEffect(() => {
        if (ellipsized && !expanded && content.current !== null) {
            setOverflowing(isOverflowing(content.current));
        }
    });

    return (
        <div className={`${item.className ?? ''} ibexa-details__item`.trim()}>
            <div className="ibexa-details__item-label ibexa-label">{item.label}</div>
            <div className="ibexa-details__item-content-wrapper">
                <div
                    ref={content}
                    className={contentClassName(ellipsized, expanded, item.lines)}
                    style={item.lines !== undefined ? ({ '--ibexa-details__ellipsized-lines-no': item.lines } as CSSProperties) : undefined}
                >
                    {item.content}
                </div>
                {ellipsized ? (
                    <div className="ibexa-details__item-content-actions">
                        <button
                            type="button"
                            className={`${buttonClassName('ghost', { size: 'small' })} ibexa-details__show-more-btn${overflowing || expanded ? '' : ' ibexa-details__show-more-btn--hidden'}${expanded ? ' ibexa-details__show-more-btn--opened' : ''}`}
                            aria-expanded={expanded}
                            onClick={() => setExpanded((value) => !value)}
                        >
                            <span className={`ibexa-btn__label ibexa-details__show-more-label${expanded ? ' ibexa-details__show-more-label--hidden' : ''}`}>{showMoreLabel}</span>
                            <span className={`ibexa-btn__label ibexa-details__show-less-label${expanded ? '' : ' ibexa-details__show-less-label--hidden'}`}>{showLessLabel}</span>
                            <IconSvg name="arrow-caret-down" className={`ibexa-details__show-more-btn-icon${expanded ? ' ibexa-details__show-more-btn-icon--opened' : ''}`} />
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

/** The admin's "details" block (`ui/component/details`): a headline with its actions, then labelled values; a long value is cut and can be expanded. */
export function Details({ items, headline, actions, vertical = false, smallHeadline = false, showMoreLabel = 'Show more', showLessLabel = 'Show less' }: DetailsProps): React.ReactElement {
    return (
        <div className="ibexa-details">
            {headline !== undefined ? (
                <div className={`ibexa-details__header${smallHeadline ? ' ibexa-details__header--small' : ''}`}>
                    <TableHeader headline={headline} actions={actions} />
                </div>
            ) : null}
            <div className={`ibexa-details__items${vertical ? ' ibexa-details__items--vertical' : ''}`}>
                {items.map((item) => <DetailsRow key={item.key} item={item} showMoreLabel={showMoreLabel} showLessLabel={showLessLabel} />)}
            </div>
        </div>
    );
}
