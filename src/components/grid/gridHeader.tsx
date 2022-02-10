import React from "react";
import { GridColumn } from "../../models/gridColumn";
import { GridModifiers } from "../../models/gridModifiers";
import GridHeaderColumn from "./gridHeaderColumn";

type GridHeaderProps = {
    columns: GridColumn[]
    onGridChange: (gridModifiers: GridModifiers) => void;
    gridModifiers: GridModifiers;
    enableSort: boolean;
};

const GridHeader = (props: GridHeaderProps) => {
    const {columns, gridModifiers, enableSort, onGridChange} = props;
    return (
        <thead>
            {columns.map((column, i) => (
                <GridHeaderColumn 
                    key={i}
                    onGridChange={onGridChange} 
                    gridModifiers={gridModifiers}
                    enableSort={enableSort}
                    {...column}  />
            ))}
        </thead>
    );
}

export default GridHeader;