import React from "react"

export type PanelProps = {
    header: JSX.Element | string;
}
export const Panel: React.FunctionComponent<PanelProps> = (props) => {
    const {header, children} = props;

    return (
        <div className="panel">
            <div className="panel-header">{header}</div>
            <div className="panel-content">
                {children}
            </div>
        </div>
    );
}