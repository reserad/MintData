import { TextField } from "@mui/material";
import React from "react";
import { GridColumn, GridColumnFilterType } from "../../models/gridColumn";
import { GridFilters, GridPayloadFilter } from "../../models/gridFilters";

type GridHeaderProps = {
    onGridChange: (gridFilters: GridFilters) => void;
    gridFilters: GridFilters;
    enableSort: boolean;
    filterType?: string;
} & GridColumn

export const getNewColumFilters = (gridFilters: GridFilters, columnName: string, filterType: GridColumnFilterType, value: string): GridPayloadFilter[] => {
    let newFilters: GridPayloadFilter[] = gridFilters.filters;

    let filterColumns = gridFilters.filters.map(x => x.column);

    if (value !== '') {
        if (!filterColumns.includes(columnName)) {
            newFilters.push({
                column: columnName,
                value,
                filterType
            })
        } else {
            for (let filterColumnIndex = 0; filterColumnIndex < newFilters.length; filterColumnIndex++ ) {
                if (newFilters[filterColumnIndex].column === columnName) {
                    newFilters[filterColumnIndex].value = value;
                }
            }
        }
    } else {
        if (filterColumns.includes(columnName)) {
            newFilters = gridFilters.filters.filter(x => x.column !== columnName);
        }
    }

    return newFilters;
}

const GridHeaderColumn: React.FunctionComponent<GridHeaderProps> = (props) => {
    const { width = null, className = null, title, onGridChange, gridFilters, name, enableSort, filterType } = props;


    const handleFilterChange = (value: string) => {
        const newFilters = getNewColumFilters(gridFilters, name, filterType, value);
        onGridChange({...gridFilters, filters: newFilters});
    }

    return (
        <tr 
            className={`${className}`} 
            style={{width}}
        >
            <th>
                <div style={{height: 45}}>
                    {filterType &&
                        <TextField variant='outlined' label={title} size="small" onChange={(event) => handleFilterChange(event.target.value)} />
                    }
                </div>
                <div className={`${enableSort && 'sortable'} ${gridFilters.sortBy === name ? 'sorted' : ''}`}  onClick={enableSort ? () => onGridChange({...gridFilters, sortBy: name, direction: gridFilters.direction === 'asc' ? 'desc' : 'asc'}) : null}>{title}</div>
            </th>
        </tr>
    );
}

export const Column: React.FunctionComponent<GridColumn> = () => {return null};

export default GridHeaderColumn;