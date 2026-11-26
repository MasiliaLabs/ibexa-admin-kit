import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';

import { activeSection } from './anchor';
import type { SectionBox } from './anchor';

export interface AnchorSectionDef {
    id: string;
    label: string;
}

interface AnchorNavigationProps {
    /** The sections, in the order of the page: the menu has one entry for each (with fewer than two there is no menu) */
    sections: AnchorSectionDef[];
    /** The `AnchorSection`s */
    children: ReactNode;
    /** The element that scrolls (the window when the page itself does) */
    scrollRef?: RefObject<HTMLElement | null>;
    /** The line under what stays fixed at the top of the page: a section that has scrolled above it is behind (the admin's is 36 plus its header) */
    offset?: number;
    /** The title of the menu */
    menuLabel?: string;
}

/** A section of a page with an anchor menu: what a menu entry takes the person to. */
export function AnchorSection({ id, children }: { id: string; children: ReactNode }): React.ReactElement {
    return <div data-id={id} className="ibexa-anchor-navigation__section">{children}</div>;
}

/**
 * A long page cut into sections, with the menu of the admin's anchor navigation (`ui/anchor_navigation_menu`) beside it: the entry of the
 * section being read is lit as the page scrolls, and an entry takes the person to its section. What the admin's content form adds
 * (the last section padded to reach the top) is that page's, not here.
 */
export function AnchorNavigation({ sections, children, scrollRef, offset = 36, menuLabel = 'Sections' }: AnchorNavigationProps): React.ReactElement {
    const root = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(sections[0]?.id ?? '');

    const sectionNodes = useCallback((): HTMLElement[] => [...(root.current?.querySelectorAll<HTMLElement>('.ibexa-anchor-navigation__section') ?? [])], []);

    useEffect(() => {
        const scroller: HTMLElement | Window = scrollRef?.current ?? window;
        const onScroll = (): void => {
            const boxes: SectionBox[] = sectionNodes().map((node) => {
                const { top, height } = node.getBoundingClientRect();

                return { id: node.dataset.id ?? '', top, height };
            });
            const next = activeSection(boxes, offset);
            if (next !== null) {
                setActive(next);
            }
        };
        scroller.addEventListener('scroll', onScroll, { passive: true });

        return () => scroller.removeEventListener('scroll', onScroll);
    }, [scrollRef, offset, sectionNodes]);

    const goTo = (id: string): void => {
        const node = sectionNodes().find((candidate) => candidate.dataset.id === id);
        if (node === undefined) {
            return;
        }
        setActive(id);
        const scroller = scrollRef?.current;
        if (scroller !== null && scroller !== undefined) {
            scroller.scrollTo({ top: node.offsetTop, behavior: 'smooth' });
        } else {
            node.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div ref={root} className="masilia-kit-anchors">
            {sections.length > 1 ? (
                <nav className="ibexa-anchor-navigation-menu" aria-label={menuLabel}>
                    <div className="ibexa-anchor-navigation-menu__body">
                        <ul className="ibexa-anchor-navigation-menu__sections ibexa-anchor-navigation-menu__sections--active ibexa-anchor-navigation-menu__sections--no-border">
                            <li className="ibexa-anchor-navigation-menu__sections-header">{menuLabel}</li>
                            {sections.map((section) => (
                                <li key={section.id} className="ibexa-anchor-navigation-menu__sections-item">
                                    <button
                                        type="button"
                                        className={`ibexa-anchor-navigation-menu__sections-item-btn${active === section.id ? ' ibexa-anchor-navigation-menu__sections-item-btn--active' : ''}`}
                                        aria-current={active === section.id ? 'true' : undefined}
                                        data-target-id={`#${section.id}`}
                                        onClick={() => goTo(section.id)}
                                    >
                                        <span className="ibexa-anchor-navigation-menu__sections-item-btn-label">{section.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            ) : null}
            <div className="ibexa-anchor-navigation-sections masilia-kit-anchors__sections">{children}</div>
        </div>
    );
}
