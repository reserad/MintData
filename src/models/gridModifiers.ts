export type GridModifiers = {
    sortBy: string,
    direction: 'asc' | 'desc',
    page: number,
    take: number;
    columnFilters: GridFilter[]
}

export type GridFilter = {
    column: string;
    value: string;
    filterType: string;
}