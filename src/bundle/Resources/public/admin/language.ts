/** The name of a language in the language of the admin: "French (fr)"; the code alone when the runtime does not know the language. Pure given the locale, so it is tested without a page. */
export function languageLabel(code: string, locale: string = typeof document === 'undefined' ? 'en' : document.documentElement.lang || 'en'): string {
    try {
        const name = new Intl.DisplayNames([locale], { type: 'language' }).of(code);

        return name !== undefined && name !== code ? `${name} (${code})` : code;
    } catch {
        return code;
    }
}
