export type GridColumn = {
    name: string;
    width?: number;
    className?: string;
    title: string;
    render?: (data: any) => React.ReactNode;
    filterType?: GridColumnFilterType;
    filterInputType?: GridColumnFilterInputType;
    filterInputOptions?: string[];
};

export enum GridColumnFilterType {
    Contains = 'contains',
    Equals = 'equals',
    Date = ''
}

export enum GridColumnFilterInputType {
    Text = 'text',
    Dropdown = 'dropdown'
}