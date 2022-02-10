import { TextField } from "@mui/material";
import React from "react";
import { GridColumn, GridColumnFilterType } from "../../models/gridColumn";
import { GridFilter, GridModifiers } from "../../models/gridModifiers";
import {debounce} from 'lodash';

export type GridHeaderProps = {
    onGridChange: (gridModifiers: GridModifiers) => void;
    gridModifiers: GridModifiers;
    enableSort: boolean;
    filterType?: string;
} & GridColumn

export const getNewColumFilters = (gridModifiers: GridModifiers, columnName: string, filterType: GridColumnFilterType, value: string): GridFilter[] => {
    let newColumnFilters: GridFilter[] = gridModifiers.columnFilters;

    let filterColumns = gridModifiers.columnFilters.map(x => x.column);

    if (value !== '') {
        if (!filterColumns.includes(columnName)) {
            newColumnFilters.push({
                column: columnName,
                value,
                filterType
            })
        } else {
            newColumnFilters.forEach(columnFilter => {
                if (columnFilter.column === columnName) {
                    columnFilter.value = value;
                }
            });
        }
    } else {
        if (filterColumns.includes(columnName)) {
            newColumnFilters = gridModifiers.columnFilters.filter(x => x.column !== columnName);
        }
    }

    return newColumnFilters;
}

const GridHeaderColumn: React.FunctionComponent<GridHeaderProps> = (props) => {
    const { width = null, className = null, title, onGridChange, gridModifiers, name, enableSort, filterType } = props;

    const handleDebouncedFilterChange = debounce((value: string) => {
        handleFilterChange(value);
    }, 500);

    const handleFilterChange = (value: string) => {
        const newFilters = getNewColumFilters(gridModifiers, name, filterType, value);
        onGridChange({...gridModifiers, columnFilters: newFilters});
    }

    const handleOnSortClick = () => {
        if (enableSort) {
            onGridChange({...gridModifiers, sortBy: name, direction: gridModifiers.direction === 'asc' ? 'desc' : 'asc'});
        }
    }

    return (
        <tr 
            className={`${className}`} 
            style={{width}}
        >
            <th>
                <div style={{height: 45, marginLeft: 5, marginRight: 5}}>
                    {filterType &&
                        <TextField inputProps={{ "data-testid": `${name}-filter` }} variant='outlined' label={title} size="small" onChange={(event) => handleDebouncedFilterChange(event.target.value)} fullWidth={true} />
                    }
                </div>
                <div data-testid={`${name}-sort`} className={`${enableSort && 'sortable'} ${gridModifiers.sortBy === name ? 'sorted' : ''}`}  onClick={handleOnSortClick}>{title}</div>
            </th>
        </tr>
    );
}

export const Column: React.FunctionComponent<GridColumn> = () => {return null};

export default GridHeaderColumn;