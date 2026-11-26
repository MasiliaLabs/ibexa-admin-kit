/** The classes of a button of the admin (`btn ibexa-btn …`): pure, so every component that draws one says it the same way and is tested without a page. */

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'dark' | 'filled-info';
export type ButtonSize = 'medium' | 'small';

interface ButtonClassOptions {
    size?: ButtonSize;
    /** An icon and no text */
    noText?: boolean;
    /** Other classes the button carries (the one of its container, for the styles that hang on it) */
    extra?: string;
}

/** `variant` is `null` for a button that has none of its own (the close button of an alert takes the colours of its alert). */
export function buttonClassName(variant: ButtonVariant | null, { size = 'medium', noText = false, extra = '' }: ButtonClassOptions = {}): string {
    return ['btn', 'ibexa-btn', variant !== null ? `ibexa-btn--${variant}` : '', size === 'small' ? 'ibexa-btn--small' : '', noText ? 'ibexa-btn--no-text' : '', extra]
        .filter((name) => name !== '')
        .join(' ');
}
