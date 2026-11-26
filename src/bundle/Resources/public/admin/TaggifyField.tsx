import React, { useId, useState } from 'react';

import { buttonClassName } from './buttons';
import { FieldFrame, describedBy } from './Field';
import { IconSvg } from './IconSvg';
import { addTags, DEFAULT_ACCEPT_KEYS, isAcceptKey, matchesPattern, removeTag, splitTags } from './taggify';

interface TaggifyFieldProps {
    label: string;
    tags: string[];
    onChange: (tags: string[]) => void;
    /** The keys that end a tag (Enter by default); a key of one character, such as "," is also a separator in what is typed or pasted */
    acceptKeys?: readonly string[];
    /** What a tag must look like: what is typed is not turned into a tag unless it matches */
    pattern?: RegExp;
    placeholder?: string;
    /** What is typed becomes a tag when the field loses the focus (the admin's default) */
    addOnBlur?: boolean;
    /** The name of the button that removes a tag, for assistive technology */
    removeLabel?: (tag: string) => string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

/**
 * The admin's tag field (`ibexa-taggify`, the markup and classes of its component and the rules of its script, written for React: the script
 * adds and removes elements itself, which React cannot share): tags with a remove button, and a field to type the next one in.
 */
export function TaggifyField({ label, tags, onChange, acceptKeys = DEFAULT_ACCEPT_KEYS, pattern, placeholder, addOnBlur = true, removeLabel = (tag) => `Remove ${tag}`, hint, error, disabled, required }: TaggifyFieldProps): React.ReactElement {
    const id = useId();
    const [draft, setDraft] = useState('');

    const commit = (text: string): void => {
        const incoming = splitTags(text, acceptKeys);
        if (incoming.length > 0) {
            onChange(addTags(tags, incoming));
        }
        setDraft('');
    };

    return (
        <FieldFrame id={id} label={label} required={required} hint={hint} error={error}>
            <div className="ibexa-taggify">
                <div className={`ibexa-taggify__list form-control${error !== undefined ? ' is-invalid' : ''}`}>
                    {tags.map((tag) => (
                        <div key={tag} className="ibexa-taggify__list-tag">
                            <span className="ibexa-taggify__list-tag-name">{tag}</span>
                            <button
                                type="button"
                                className={buttonClassName('ghost', { size: 'small', noText: true, extra: 'ibexa-taggify__btn--remove' })}
                                aria-label={removeLabel(tag)}
                                disabled={disabled}
                                onClick={() => onChange(removeTag(tags, tag))}
                            >
                                <IconSvg name="discard" size="tiny" />
                            </button>
                        </div>
                    ))}
                    <input
                        id={id}
                        type="text"
                        className="ibexa-taggify__input"
                        value={draft}
                        placeholder={placeholder}
                        disabled={disabled}
                        aria-invalid={error !== undefined}
                        aria-describedby={describedBy(id, hint, error)}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                            if (isAcceptKey(event.key, acceptKeys) && matchesPattern(draft, pattern)) {
                                // Enter must not send the form the field is in
                                event.preventDefault();
                                commit(draft);
                            }
                        }}
                        onBlur={() => { if (addOnBlur) { commit(draft); } }}
                    />
                </div>
            </div>
        </FieldFrame>
    );
}
