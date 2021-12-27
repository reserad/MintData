import React from "react";
import { GridColumn } from "../../models/gridColumn";
import { GridFilters } from "../../models/gridFilters";

type GridHeaderProps = {
    onGridChange: (gridFilters: GridFilters) => void;
    gridFilters: GridFilters;
    enableSort: boolean;
} & GridColumn

const GridHeaderColumn: React.FunctionComponent<GridHeaderProps> = (props) => {
    const { width = null, className = null, title, onGridChange, gridFilters, name, enableSort } = props;
    return (
        <tr 
            className={`${className} ${enableSort && 'sortable'} ${gridFilters.sortBy === name ? 'sorted' : ''}`} 
            style={{width}}
            onClick={enableSort ? () => onGridChange({...gridFilters, sortBy: name, direction: gridFilters.direction === 'asc' ? 'desc' : 'asc'}) : null}
        >
            <th>{title}</th>
        </tr>
    );
}

export const Column: React.FunctionComponent<GridColumn> = () => {return null};

export default GridHeaderColumn;