import { TextField } from "@mui/material";
import React from "react";
import { GridColumn, GridColumnFilterType } from "../../models/gridColumn";
import { GridFilters, GridPayloadFilter } from "../../models/gridFilters";

export type GridHeaderProps = {
    onGridChange: (gridFilters: GridFilters) => void;
    gridFilters: GridFilters;
    enableSort: boolean;
    filterType?: string;
} & GridColumn

export const getNewColumFilters = (gridFilters: GridFilters, columnName: string, filterType: GridColumnFilterType, value: string): GridPayloadFilter[] => {
    let newColumnFilters: GridPayloadFilter[] = gridFilters.columnFilters;

    let filterColumns = gridFilters.columnFilters.map(x => x.column);

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
            newColumnFilters = gridFilters.columnFilters.filter(x => x.column !== columnName);
        }
    }

    return newColumnFilters;
}

const GridHeaderColumn: React.FunctionComponent<GridHeaderProps> = (props) => {
    const { width = null, className = null, title, onGridChange, gridFilters, name, enableSort, filterType } = props;


    const handleFilterChange = (value: string) => {
        const newFilters = getNewColumFilters(gridFilters, name, filterType, value);
        onGridChange({...gridFilters, columnFilters: newFilters});
    }

    const handleOnSortClick = () => {
        if (enableSort) {
            onGridChange({...gridFilters, sortBy: name, direction: gridFilters.direction === 'asc' ? 'desc' : 'asc'});
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
                        <TextField data-testid={`${name}-filter`} variant='outlined' label={title} size="small" onChange={(event) => handleFilterChange(event.target.value)} fullWidth={true} />
                    }
                </div>
                <div className={`${enableSort && 'sortable'} ${gridFilters.sortBy === name ? 'sorted' : ''}`}  onClick={handleOnSortClick}>{title}</div>
            </th>
        </tr>
    );
}

export const Column: React.FunctionComponent<GridColumn> = () => {return null};

export default GridHeaderColumn;