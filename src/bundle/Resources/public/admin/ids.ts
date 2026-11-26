/**
 * Typed access to the Ibexa Design System components (@ids-components).
 *
 * The design system ships JavaScript without typings, and its CommonJS re-exports are not visible to
 * TypeScript. The components used here are declared once, in this file, so the rest of the widget stays typed.
 */

import type { ComponentType, ReactNode } from 'react';
import * as ids from '@ids-components';
// The package root does not re-export the chip: it is reached by its own path.
import * as chipModule from '@ids-components/components/Chip';
// The package root re-exports AltRadioInput but not the list field: it is reached by its own path.
import * as altRadioList from '@ids-components/components/AltRadio/AltRadiosListField';

export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'secondary-alt' | 'tertiary-alt';

export interface ButtonProps {
    type?: ButtonType;
    size?: 'medium' | 'small';
    icon?: string;
    ariaLabel?: string;
    title?: string;
    disabled?: boolean;
    onClick?: () => void;
    extraAria?: Record<string, string | boolean>;
    children?: ReactNode;
}

export interface AssetsValue {
    getIconPath: (name: string) => string;
}

export interface DropdownSingleProps {
    name?: string;
    items: Array<{ id: string; label: string }>;
    /** The id selected; empty: nothing selected (the placeholder shows) */
    value: string;
    onChange: (id: string) => void;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    /** More items than this and the list gets a search field (the design system's own rule; 10 by default) */
    maxVisibleItems?: number;
    renderEmptySelectionInfo?: () => ReactNode;
}

export interface DropdownMultiProps {
    name?: string;
    items: Array<{ id: string; label: string }>;
    /** The ids selected */
    value: string[];
    onChange: (ids: string[]) => void;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    maxVisibleItems?: number;
    renderEmptySelectionInfo?: () => ReactNode;
}

export type TagType = 'primary' | 'primary-alt' | 'success' | 'info' | 'warning' | 'error' | 'neutral';

export interface TagProps {
    type: TagType;
    size?: 'medium' | 'small';
    isDark?: boolean;
    icon?: string;
    children?: ReactNode;
}

export interface ChipProps {
    isDeletable?: boolean;
    onDelete?: () => void;
    disabled?: boolean;
    error?: boolean;
    children?: ReactNode;
}

export interface BadgeProps {
    variant?: 'string' | 'number';
    size?: 'medium' | 'small';
    value: string | number;
    maxValue?: number;
}

export interface AccordionProps {
    header: ReactNode;
    /** Follows the prop: when it changes the accordion opens or closes with it */
    initiallyExpanded?: boolean;
    onHandleExpand?: (expanded: boolean) => void;
    children?: ReactNode;
}

export interface IconProps {
    name: string;
    size?: 'tiny' | 'tiny-small' | 'small' | 'medium' | 'large' | 'extra-large';
    className?: string;
}

export interface AltRadioItem {
    id: string;
    value: string;
    label: string;
    /** The longer explanation, as a tooltip */
    title?: string;
    disabled?: boolean;
    error?: boolean;
}

export interface AltRadiosListFieldProps {
    id: string;
    name: string;
    /** The list's own label: leave it out inside a `FieldFrame`, which has the label */
    label?: string;
    items: AltRadioItem[];
    value: string;
    onChange: (value: string) => void;
    direction?: 'horizontal' | 'vertical';
    helperText?: string;
    required?: boolean;
    className?: string;
}

export interface RadioButtonItem {
    /** The design system's list does not give its items a key (React asks for one): the same as `id` */
    key?: string;
    id: string;
    value: string;
    label: string;
    disabled?: boolean;
    error?: boolean;
}

export interface RadioButtonsListFieldProps {
    id: string;
    name: string;
    /** The list's own label: leave it out inside a `FieldFrame`, which has the label */
    label?: string;
    items: RadioButtonItem[];
    value: string;
    onChange: (value: string) => void;
    direction?: 'horizontal' | 'vertical';
    helperText?: string;
    required?: boolean;
    className?: string;
}

export interface ToggleButtonInputProps {
    id?: string;
    name?: string;
    checked?: boolean;
    disabled?: boolean;
    /** Gets the new state */
    onChange: (checked: boolean) => void;
    /** What the switch says in each position (shown beside it) */
    onLabel?: string;
    offLabel?: string;
    size?: 'medium' | 'small';
    title?: string;
}

export type AutosaveStatusValue = 'on' | 'saving' | 'saved' | 'error';

export interface AutosaveProps {
    /** `on`: it saves by itself; `saving`, `saved` and `error` say where it is */
    status: AutosaveStatusValue;
    /** Autosave is on for this page at all */
    isEnabled?: boolean;
    /** When it last saved, as the text to show ("11:42") */
    lastSavedTime?: string;
    isDarkMode?: boolean;
}

export interface TranslatorValue {
    trans: (id: string) => string;
}

interface IdsComponents {
    Button: ComponentType<ButtonProps>;
    AssetsProvider: ComponentType<{ value: AssetsValue; children?: ReactNode }>;
    TranslatorProvider: ComponentType<{ value: TranslatorValue; children?: ReactNode }>;
    DropdownSingleInput: ComponentType<DropdownSingleProps>;
    DropdownMultiInput: ComponentType<DropdownMultiProps>;
    Tag: ComponentType<TagProps>;
    Badge: ComponentType<BadgeProps>;
    Accordion: ComponentType<AccordionProps>;
    Icon: ComponentType<IconProps>;
    RadioButtonsListField: ComponentType<RadioButtonsListFieldProps>;
    ToggleButtonInput: ComponentType<ToggleButtonInputProps>;
    Autosave: ComponentType<AutosaveProps>;
}

const components = ids as unknown as IdsComponents;

export const Button = components.Button;
export const AssetsProvider = components.AssetsProvider;
export const TranslatorProvider = components.TranslatorProvider;
export const DropdownSingleInput = components.DropdownSingleInput;
export const DropdownMultiInput = components.DropdownMultiInput;
export const Tag = components.Tag;
export const Chip = (chipModule as unknown as { Chip: ComponentType<ChipProps> }).Chip;
export const Badge = components.Badge;
export const Accordion = components.Accordion;
export const Icon = components.Icon;
export const AltRadiosListField = (altRadioList as unknown as { AltRadiosListField: ComponentType<AltRadiosListFieldProps> }).AltRadiosListField;
export const RadioButtonsListField = components.RadioButtonsListField;
export const ToggleButtonInput = components.ToggleButtonInput;
export const Autosave = components.Autosave;
