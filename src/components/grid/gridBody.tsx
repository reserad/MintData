import React from "react";
import { GridColumn } from "../../models/gridColumn";

type GridBodyProps = {
    data: any[];
    columns: GridColumn[];
};

const GridBody = (props: GridBodyProps) => {
    const {data, columns} = props;
    return (
        <tbody>
            {data.map((transaction, i) => {
                return (
                    <tr key={transaction.id}>
                        {columns.map((column, i) => {
                            let style: React.CSSProperties = {}
                            if (column.width) {
                                style.width = column.width
                            }

                            if (column.render) {
                                return (<td key={transaction.id + column.name} className={column.className} style={style}>{column.render(transaction[column.name])}</td>)
                            }

                            return (
                                <td key={transaction.id + column.name} className={column.className} style={style}>{transaction[column.name]}</td>
                            );
                        })}
                    </tr>
                )
            })}
        </tbody>
    );
}

export default GridBody;