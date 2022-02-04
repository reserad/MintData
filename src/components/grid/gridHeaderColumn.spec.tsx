import * as React from 'react';
import { GridColumnFilterType } from "../../models/gridColumn";
import { GridFilters, GridPayloadFilter } from "../../models/gridFilters";
import GridHeaderColumn, { getNewColumFilters, GridHeaderProps } from "./gridHeaderColumn";
import { render, RenderResult, fireEvent } from '@testing-library/react';

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

describe('<GridHeaderColumn />', () => {
    let gridHeaderProps: GridHeaderProps;

    beforeEach(() => {
        gridHeaderProps = {
            gridFilters: {
                columnFilters: [],
                direction: 'asc',
                page: 1,
                sortBy: '',
                take: 20
            },
            enableSort: false,
            title: "Test",
            name: "test",
            onGridChange: (gridFilters: GridFilters) => {} 
        };
    });
    
    it('Should find no filter', () => {
        const body = render(
            <table>
                <tbody>
                    <GridHeaderColumn 
                        {...gridHeaderProps}
                    />
                </tbody>
            </table>
        );
        expect(body.queryByTestId('test-filter')).toBeFalsy();
    });

    it('Should find a filter', () => {
        gridHeaderProps.filterType = GridColumnFilterType.Contains;

        const body = render(
            <table>
                <tbody>
                    <GridHeaderColumn 
                        {...gridHeaderProps}
                    />
                </tbody>
            </table>
        );
        expect(body.queryByTestId('test-filter')).toBeTruthy();
    });

    it('Should call onGridChange when changing filter text', () => {
        const onGridChange = jest.fn();
        gridHeaderProps.filterType = GridColumnFilterType.Contains;
        gridHeaderProps.onGridChange = onGridChange;

        const body = render(
            <table>
                <tbody>
                    <GridHeaderColumn 
                        {...gridHeaderProps}
                    />
                </tbody>
            </table>
        );

        fireEvent.change(body.queryByTestId('test-filter'), {target: {value: 'test'}})

        expect(onGridChange).toHaveBeenCalled();
    });

    it('Should not call onGridChange when clicking column header text', () => {
        const onGridChange = jest.fn();
        gridHeaderProps.onGridChange = onGridChange;

        const body = render(
            <table>
                <tbody>
                    <GridHeaderColumn 
                        {...gridHeaderProps}
                    />
                </tbody>
            </table>
        );

        body.queryByTestId('test-sort').click();

        expect(onGridChange).toHaveBeenCalledTimes(0);
    });

    it('Should call onGridChange when clicking column header text', () => {
        const onGridChange = jest.fn();
        gridHeaderProps.enableSort = true;
        gridHeaderProps.onGridChange = onGridChange;

        const body = render(
            <table>
                <tbody>
                    <GridHeaderColumn 
                        {...gridHeaderProps}
                    />
                </tbody>
            </table>
        );

        body.queryByTestId('test-sort').click();

        expect(onGridChange).toHaveBeenCalled();
    });
});