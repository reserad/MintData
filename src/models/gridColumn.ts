export type GridColumn = {
    name: string;
    width?: number;
    className?: string;
    title: string;
    render?: (data: any) => React.ReactNode;
};