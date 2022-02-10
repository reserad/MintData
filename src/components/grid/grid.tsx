import React from "react";
import { GridColumn } from "../../models/gridColumn";
import { GridModifiers } from "../../models/gridModifiers";
import { TransactionsGrid } from "../../models/transactionsGrid";
import GridBody from "./gridBody";
import { GridFooter } from "./gridFooter";
import GridHeader from "./gridHeader";
import { Column } from "./gridHeaderColumn";

export type GridProps = {
    gridData: TransactionsGrid;
    enableFooter?: boolean;
    enableSort?: boolean;
    gridModifiers: GridModifiers;
    onGridChange: (gridModifiers: GridModifiers) => void;
};

const Grid: React.FunctionComponent<GridProps> = (props) => {
    const { children, gridData, gridModifiers, onGridChange, enableFooter = false, enableSort = false} = props;
    const {data, pagination} = gridData;
    let componentChildren = children as React.ReactElement<any>[];

    if (!(componentChildren instanceof Array)) {
        componentChildren = Array(componentChildren);
    }

    if (componentChildren.length === 0 || !componentChildren.map(child => child.type).includes(Column)) {
        return (null);
    }

    const columnDefinitions: GridColumn[] = componentChildren.map(child => {
        if (child.type === Column) {
            return child.props as GridColumn;
        }
    });

    return (
        <table style={{width: '100%'}}>
            <GridHeader 
                columns={columnDefinitions} 
                onGridChange={onGridChange} 
                gridModifiers={gridModifiers} 
                enableSort={enableSort} />
            <GridBody 
                data={data} 
                columns={columnDefinitions} />
            {enableFooter && 
                <GridFooter
                    onGridChange={onGridChange} 
                    gridModifiers={gridModifiers} 
                    pagination={pagination} />
            }
        </table>
    );
}

export default Grid;