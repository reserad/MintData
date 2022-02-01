export type GridColumn = {
    name: string;
    width?: number;
    className?: string;
    title: string;
    render?: (data: any) => React.ReactNode;
    filterType?: GridColumnFilterType
};

export enum GridColumnFilterType {
    Contains = 'contains',
    Equals = 'equals'
}