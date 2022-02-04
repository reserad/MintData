import * as React from 'react';
import { GridFilters } from "../../models/gridFilters";
import { getNewPageNumber, getNewGridFilters, getPageButtonIndexes, GridFooterProps, GridFooter } from "./gridFooter";
import { render, RenderResult, fireEvent } from '@testing-library/react';

test('test adjusted page number for page size = 20', () => {
    let newPageNumber = getNewPageNumber(5, 200, 20);
    expect(newPageNumber).toEqual(11)
});

test('test adjusted page number for page size = 50', () => {
    let newPageNumber = getNewPageNumber(5, 80, 50);
    expect(newPageNumber).toEqual(2)
});

test('test adjusted page number for page size = 100', () => {
    let newPageNumber = getNewPageNumber(5, 200, 100);
    expect(newPageNumber).toEqual(3)
});

describe('When the grid has 100 pages', () => {
    test('Expect page buttons to start at 1 and end at 10', () => {
        const expectedPageButtons = [1,2,3,4,5,6,7,8,9,10]
        let pageButtons = getPageButtonIndexes(1, 100);
        expect(pageButtons).toEqual(expectedPageButtons)
    });

    test('Expect page buttons to start at 2 and end at 11', () => {
        const expectedPageButtons = [2,3,4,5,6,7,8,9,10,11]
        let pageButtons = getPageButtonIndexes(7, 100);
        expect(pageButtons).toEqual(expectedPageButtons)
    });

    test('Expect page buttons to start at 93 and end at 100', () => {
        const expectedPageButtons = [93,94,95,96,97,98,99,100]
        let pageButtons = getPageButtonIndexes(98, 100);
        expect(pageButtons).toEqual(expectedPageButtons)
    });
});

describe('When the current page of the grid is 5', () => {
    const gridFooterProps: GridFooterProps = {
        gridFilters: {
            direction: 'asc',
            columnFilters: [],
            page: 5,
            sortBy: '',
            take: 20
        },
        onGridChange: () => {},
        pagination: {
            currentPage: 5,
            from: 100,
            lastPage: 100,
            perPage: 20,
            to: 120,
            total: 2000
        }
    };

    test('Expect the page to be 1', () => {
        const expectedGridFilters: GridFilters = {
            direction: 'asc',
            columnFilters: [],
            page: 1,
            sortBy: '',
            take: 20
        };
        const newGridFilters: GridFilters = getNewGridFilters(gridFooterProps, 'first');
        expect(newGridFilters).toEqual(expectedGridFilters)
    });

    test('Expect the page to be 4', () => {
        const expectedGridFilters: GridFilters = {
            direction: 'asc',
            columnFilters: [],
            page: 4,
            sortBy: '',
            take: 20
        };
        const newGridFilters: GridFilters = getNewGridFilters(gridFooterProps, 'previous');
        expect(newGridFilters).toEqual(expectedGridFilters)
    });

    test('Expect the page to be 6', () => {
        const expectedGridFilters: GridFilters = {
            direction: 'asc',
            columnFilters: [],
            page: 6,
            sortBy: '',
            take: 20
        };
        const newGridFilters: GridFilters = getNewGridFilters(gridFooterProps, 'next');
        expect(newGridFilters).toEqual(expectedGridFilters)
    });

    test('Expect the page to be 100', () => {
        const expectedGridFilters: GridFilters = {
            direction: 'asc',
            columnFilters: [],
            page: 100,
            sortBy: '',
            take: 20
        };
        const newGridFilters: GridFilters = getNewGridFilters(gridFooterProps, 'last');
        expect(newGridFilters).toEqual(expectedGridFilters)
    });
});

describe('<GridFooter />', () => {
    let gridFooterProps: GridFooterProps;
    const onGridChange = jest.fn();

    beforeEach(() => {
        gridFooterProps = {
            gridFilters: {
                direction: 'asc',
                columnFilters: [],
                page: 5,
                sortBy: '',
                take: 20
            },
            onGridChange,
            pagination: {
                currentPage: 5,
                from: 100,
                lastPage: 100,
                perPage: 20,
                to: 120,
                total: 2000
            }
        };
    });
    
    test('Expect first page button to call onGridChange', () => {
        const body = render(
            <table>
                <GridFooter 
                    {...gridFooterProps}
                />
            </table>
        );

        body.queryByTestId('page-first').click();

        expect(onGridChange).toHaveBeenCalled();
    });

    test('Expect last page button to call onGridChange', () => {
        const body = render(
            <table>
                <GridFooter 
                    {...gridFooterProps}
                />
            </table>
        );

        body.queryByTestId('page-last').click();

        expect(onGridChange).toHaveBeenCalled();
    });

    test('Expect next page button to call onGridChange', () => {
        const body = render(
            <table>
                <GridFooter 
                    {...gridFooterProps}
                />
            </table>
        );

        body.queryByTestId('page-next').click();

        expect(onGridChange).toHaveBeenCalled();
    });

    test('Expect previous page button to call onGridChange', () => {
        const body = render(
            <table>
                <GridFooter 
                    {...gridFooterProps}
                />
            </table>
        );

        body.queryByTestId('page-previous').click();

        expect(onGridChange).toHaveBeenCalled();
    });

    test('Expect page number button to call onGridChange', () => {
        const body = render(
            <table>
                <GridFooter 
                    {...gridFooterProps}
                />
            </table>
        );

        body.queryByTestId('page-1').click();

        expect(onGridChange).toHaveBeenCalled();
    });

    test('Expect changing page size to call onGridChange', () => {
        const body = render(
            <table>
                <GridFooter 
                    {...gridFooterProps}
                />
            </table>
        );

        fireEvent.change(body.queryByTestId('page-size'), {target: {value: 50}});

        expect(onGridChange).toHaveBeenCalled();
    });
});