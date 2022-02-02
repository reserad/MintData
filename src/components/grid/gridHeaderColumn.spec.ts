import { GridColumnFilterType } from "../../models/gridColumn";
import { GridFilters } from "../../models/gridFilters";
import { getNewColumFilters } from "./gridHeaderColumn";

test('test adding new filter', () => {
    let existingFilters: GridFilters = {
        sortBy: '',
        page: 0,
        take: 20,
        direction: 'asc',
        columnFilters: []
    };
    let filters = getNewColumFilters(existingFilters, 'test', GridColumnFilterType.Contains, 'abc');

    const addedFilter = filters[0];

    expect(addedFilter.column === 'test').toBeTruthy();
    expect(addedFilter.value === 'abc').toBeTruthy();
});

test('test updating filter', () => {
    let existingFilters: GridFilters = {
        sortBy: '',
        page: 0,
        take: 20,
        direction: 'asc',
        columnFilters: [{
            column: 'test',
            filterType: GridColumnFilterType.Contains,
            value: 'abc'
        }]
    };
    let filters = getNewColumFilters(existingFilters, 'test', GridColumnFilterType.Contains, 'ab');

    const addedFilter = filters[0];

    expect(addedFilter.column === 'test').toBeTruthy();
    expect(addedFilter.value === 'ab').toBeTruthy();
});

test('test remove filter', () => {
    let existingFilters: GridFilters = {
        sortBy: '',
        page: 0,
        take: 20,
        direction: 'asc',
        columnFilters: [{
            column: 'test',
            filterType: GridColumnFilterType.Contains,
            value: 'abc'
        }]
    };
    let filters = getNewColumFilters(existingFilters, 'test', GridColumnFilterType.Contains, '');

    expect(filters.length == 0).toBeTruthy();
});