export type GridFilters = {
    sortBy: string,
    direction: 'asc' | 'desc',
    page: number,
    take: number;
    columnFilters: GridPayloadFilter[]
}

export type GridPayloadFilter = {
    column: string;
    value: string;
    filterType: string;
}