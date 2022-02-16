import * as React from 'react';
import { GridModifiers } from "../../models/gridModifiers";
import { getNewPageNumber, getNewGridModifiers, getPageButtonIndexes, GridFooterProps, GridFooter } from "./gridFooter";
import { render, fireEvent } from '@testing-library/react';
import { Pagination } from '../../models/pagination';

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

describe('Footer page buttons', () => {
    let pagination: Pagination;

    beforeEach(() => {
        pagination = {
            currentPage: 1,
            lastPage: 5,
            from: 1,
            to: 20,
            perPage: 20,
            total: 100
        };
    });

    test('Expect page buttons to start at 1 and end at 10', () => {
        const expectedPageButtons = [1,2,3,4,5,6,7,8,9,10];
        pagination.total = 2000;
        pagination.currentPage = 1;
        pagination.lastPage = 100;

        let pageButtons = getPageButtonIndexes(pagination);
        expect(pageButtons).toEqual(expectedPageButtons)
    });

    test('Expect page buttons to start at 2 and end at 11', () => {
        const expectedPageButtons = [2,3,4,5,6,7,8,9,10,11];
        pagination.total = 2000;
        pagination.currentPage = 7;
        pagination.lastPage = 100;

        let pageButtons = getPageButtonIndexes(pagination);
        expect(pageButtons).toEqual(expectedPageButtons)
    });

    test('Expect page buttons to start at 93 and end at 100', () => {
        const expectedPageButtons = [93,94,95,96,97,98,99,100];
        pagination.total = 2000;
        pagination.currentPage = 98;
        pagination.lastPage = 100;

        let pageButtons = getPageButtonIndexes(pagination);
        expect(pageButtons).toEqual(expectedPageButtons)
    });

    test('Expect page buttons to start at 1 and end at 5', () => {
        const expectedPageButtons = [1,2,3,4,5];
        pagination.currentPage = 1;
        pagination.currentPage = 1;
        pagination.lastPage = 5;

        let pageButtons = getPageButtonIndexes(pagination);
        expect(pageButtons).toEqual(expectedPageButtons)
    });
});

describe('When the current page of the grid is 5', () => {
    const gridFooterProps: GridFooterProps = {
        gridModifiers: {
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
        const expectedGridModifiers: GridModifiers = {
            direction: 'asc',
            columnFilters: [],
            page: 1,
            sortBy: '',
            take: 20
        };
        const newGridModifiers: GridModifiers = getNewGridModifiers(gridFooterProps, 'first');
        expect(newGridModifiers).toEqual(expectedGridModifiers)
    });

    test('Expect the page to be 4', () => {
        const expectedGridModifiers: GridModifiers = {
            direction: 'asc',
            columnFilters: [],
            page: 4,
            sortBy: '',
            take: 20
        };
        const newGridModifiers: GridModifiers = getNewGridModifiers(gridFooterProps, 'previous');
        expect(newGridModifiers).toEqual(expectedGridModifiers)
    });

    test('Expect the page to be 6', () => {
        const expectedGridModifiers: GridModifiers = {
            direction: 'asc',
            columnFilters: [],
            page: 6,
            sortBy: '',
            take: 20
        };
        const newGridModifiers: GridModifiers = getNewGridModifiers(gridFooterProps, 'next');
        expect(newGridModifiers).toEqual(expectedGridModifiers)
    });

    test('Expect the page to be 100', () => {
        const expectedGridModifiers: GridModifiers = {
            direction: 'asc',
            columnFilters: [],
            page: 100,
            sortBy: '',
            take: 20
        };
        const newGridModifiers: GridModifiers = getNewGridModifiers(gridFooterProps, 'last');
        expect(newGridModifiers).toEqual(expectedGridModifiers)
    });
});

describe('<GridFooter />', () => {
    let gridFooterProps: GridFooterProps;
    const onGridChange = jest.fn();

    beforeEach(() => {
        gridFooterProps = {
            gridModifiers: {
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