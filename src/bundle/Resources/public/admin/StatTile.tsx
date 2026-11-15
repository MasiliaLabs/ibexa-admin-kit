import React from 'react';

/** A figure with what it counts under it: the tiles that open a page of numbers. */
export function StatTile({ value, label }: { value: string | number; label: string }): React.ReactElement {
    return (
        <div className="masilia-kit-stat">
            <strong className="masilia-kit-stat__value">{value}</strong>
            <span className="masilia-kit-stat__label">{label}</span>
        </div>
    );
}
