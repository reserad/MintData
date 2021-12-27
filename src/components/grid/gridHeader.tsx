import React from "react";
import { GridColumn } from "../../models/gridColumn";
import { GridFilters } from "../../models/gridFilters";
import GridHeaderColumn from "./gridHeaderColumn";

type GridHeaderProps = {
    columns: GridColumn[]
    onGridChange: (gridFilters: GridFilters) => void;
    gridFilters: GridFilters;
    enableSort: boolean;
};

const GridHeader = (props: GridHeaderProps) => {
    const {columns, gridFilters, enableSort, onGridChange} = props;
    return (
        <thead>
            {columns.map((column, i) => (
                <GridHeaderColumn 
                    key={i}
                    onGridChange={onGridChange} 
                    gridFilters={gridFilters}
                    enableSort={enableSort}
                    {...column}  />
            ))}
        </thead>
    );
}

export default GridHeader;