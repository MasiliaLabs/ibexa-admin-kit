import React from 'react';

import { Tag } from './ids';
import type { TagProps } from './ids';

/**
 * A badge whose text is in capitals (a language code: "EN"). The text of the kit's badges is raised a little (see `.ids-tag__content` in
 * `kit.scss`) because the font leaves a tall space above lower-case letters; capitals are already centred by the font, so this one is not.
 */
export function CapsTag(props: TagProps): React.ReactElement {
    return (
        <span className="masilia-kit-caps">
            <Tag {...props} />
        </span>
    );
}
