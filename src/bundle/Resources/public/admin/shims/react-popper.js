/**
 * masilia-react-popper-shim
 *
 * A stand-in for the `usePopper` hook of `react-popper`. The dropdown of the Ibexa Design System (ids-components, shipped by
 * ibexa/admin-ui-assets) imports `react-popper`, but Ibexa does not declare that package: a project that does not happen to
 * have it (it usually comes in through another dependency) cannot build an admin page that uses the dropdown, such as the ones of
 * the Masilia packages. The Encore setup of this bundle aliases `react-popper` to this file only when the project does not have the real
 * package, so nothing needs to be installed.
 *
 * It follows `usePopper` of react-popper 2.3 (MIT licence, (c) Federico Zivolo and contributors): the same arguments and the same
 * result (`styles`, `attributes`, `state`, `update`, `forceUpdate`), built on `@popperjs/core`, which Ibexa does declare. Only the
 * hook is provided, because it is the only part the dropdown uses.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { createPopper } from '@popperjs/core';

const EMPTY_MODIFIERS = [];
const useIsomorphicLayoutEffect = typeof window !== 'undefined' && window.document && window.document.createElement ? useLayoutEffect : useEffect;

const fromEntries = (entries) => entries.reduce((acc, [key, value]) => {
    acc[key] = value;

    return acc;
}, {});

export const usePopper = (referenceElement, popperElement, options = {}) => {
    const placement = options.placement || 'bottom';
    const strategy = options.strategy || 'absolute';
    const modifiers = options.modifiers || EMPTY_MODIFIERS;
    const onFirstUpdate = options.onFirstUpdate;

    const [state, setState] = useState({
        styles: { popper: { position: strategy, left: '0', top: '0' }, arrow: { position: 'absolute' } },
        attributes: {},
    });

    // Popper calls this after it has computed the position: it hands the styles and attributes to React, which applies them.
    const updateStateModifier = useMemo(() => ({
        name: 'updateState',
        enabled: true,
        phase: 'write',
        requires: ['computeStyles'],
        fn: ({ state: popperState }) => {
            const elements = Object.keys(popperState.elements);

            flushSync(() => {
                setState({
                    styles: fromEntries(elements.map((element) => [element, popperState.styles[element] || {}])),
                    attributes: fromEntries(elements.map((element) => [element, popperState.attributes[element]])),
                });
            });
        },
    }), []);

    // The options are only a new object when what they say changes (the caller usually makes a new one at every render).
    const popperOptions = useMemo(() => ({
        onFirstUpdate,
        placement,
        strategy,
        modifiers: [...modifiers, updateStateModifier, { name: 'applyStyles', enabled: false }],
    }), [onFirstUpdate, placement, strategy, modifiers, updateStateModifier]);

    const popperInstanceRef = useRef(null);

    useIsomorphicLayoutEffect(() => {
        if (popperInstanceRef.current) {
            popperInstanceRef.current.setOptions(popperOptions);
        }
    }, [popperOptions]);

    useIsomorphicLayoutEffect(() => {
        if (referenceElement == null || popperElement == null) {
            return undefined;
        }

        const create = options.createPopper || createPopper;
        const instance = create(referenceElement, popperElement, popperOptions);
        popperInstanceRef.current = instance;

        return () => {
            instance.destroy();
            popperInstanceRef.current = null;
        };
    }, [referenceElement, popperElement, options.createPopper]);

    return {
        state: popperInstanceRef.current ? popperInstanceRef.current.state : null,
        styles: state.styles,
        attributes: state.attributes,
        update: popperInstanceRef.current ? popperInstanceRef.current.update : null,
        forceUpdate: popperInstanceRef.current ? popperInstanceRef.current.forceUpdate : null,
    };
};
