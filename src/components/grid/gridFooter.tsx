import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Stack from '@mui/material/Stack';
import React from 'react';
import { GridFilters } from '../../models/gridFilters';
import { Pagination } from '../../models/pagination';

type GridFooterProps = {
    pagination: Pagination;
    gridFilters: GridFilters;
    onGridChange: (gridFilters: GridFilters) => void;
}

//Will show max 5 to left and 4 to right of current page.
export const getPageButtonIndexes = (currentPage: number, lastPage: number) => {
    
    let firstHalfConcat: number[] = [];
    let lastHalfConcat: number[] = [];

    if (currentPage >= 7) {
        if (currentPage - 5 >= 2) {
            firstHalfConcat = [currentPage-5, currentPage-4, currentPage-3, currentPage-2, currentPage-1]
        } else {
            firstHalfConcat = [1,2,3,4,5]
        }

        if (lastPage >= currentPage+4) {
            Array.from(Array(4).keys()).map(i => {
                lastHalfConcat.push(currentPage+(i+1));
            })
        } else {
            Array.from(Array(lastPage - currentPage).keys()).map(i => {
                lastHalfConcat.push(currentPage+(i+1));
            })
        }
        return firstHalfConcat.concat([currentPage]).concat(lastHalfConcat);
    }

    return [1,2,3,4,5,6,7,8,9,10];
}

export const getNewPageNumber = (currentPage: number, from: number, take: number) => {
    let newPage = 1;
    if (currentPage !== 1) {
        while (from >= take) {
            from -= take;
            newPage++;
        }
    }

    return newPage;
}

export const getNewGridFilters = (footerProps: GridFooterProps, paginationAction: 'first' | 'last' | 'next' | 'previous' | 'pageNumber', pageNumber: number = 0): GridFilters => {
    const {gridFilters, pagination} = footerProps;
    const {perPage, lastPage, currentPage} = pagination;

    switch(paginationAction) {
        case 'first':
            return {...gridFilters, page: 1, take: perPage};
        case 'last':
            return {...gridFilters, page: lastPage, take: perPage};
        case 'previous':
            return {...gridFilters, page: currentPage === 1 ? 1 : currentPage-1, take: perPage};
        case 'next':
            return {...gridFilters, page: currentPage === lastPage ? lastPage : currentPage+1, take: perPage}
        default:
            return {...gridFilters, page: pageNumber, take: perPage};
    }
}

const GridFooter = (props: GridFooterProps) => {
    const {pagination, onGridChange, gridFilters} = props;
    const {currentPage, lastPage, perPage, from } = pagination;
    const pageButtonIndexes = getPageButtonIndexes(currentPage, lastPage);

    const handlePageSelection = (take: number) => {
        const newPage = getNewPageNumber(currentPage, from, take);
        onGridChange({...gridFilters, page: newPage, take});
    }

    const handlePreviousButtonPress = () => {
        const newGridFilters = getNewGridFilters(props, 'previous');
        onGridChange(newGridFilters);
    }

    const handleFirstButtonPress = () => {
        const newGridFilters = getNewGridFilters(props, 'first');
        onGridChange(newGridFilters);
    }

    const handlePageButtonPress = (pageNumber: number) => {
        const newGridFilters = getNewGridFilters(props, 'pageNumber', pageNumber);
        onGridChange(newGridFilters);
    }

    const handleLastButtonPress = () => {
        const newGridFilters = getNewGridFilters(props, 'last');
        onGridChange(newGridFilters);
    }

    const handleNextButtonPress = () => {
        const newGridFilters = getNewGridFilters(props, 'next');
        onGridChange(newGridFilters);
    }

    const Footer = () => {
        return (
            <tfoot>
                <tr>
                    <td>
                        <Stack spacing={1} direction='row'>
                            <Button className="page-button first" variant='outlined' onClick={handleFirstButtonPress} disabled={currentPage === 1}>
                                ≪
                            </Button>
                            <Button className="page-button previous" variant='outlined' onClick={handlePreviousButtonPress} disabled={currentPage === 1}>
                                &lt;
                            </Button>
                            {pageButtonIndexes.map(pageNumber => {
                                return (
                                    <Button key={`footer-button-${pageNumber}`} className="page-button number" variant={currentPage !== pageNumber ? 'outlined' : 'contained'} onClick={() => handlePageButtonPress(pageNumber)}>{pageNumber}</Button>
                                )
                            })}
                            <Button className="page-button next" variant='outlined' onClick={handleNextButtonPress} disabled={currentPage === lastPage}>
                                &gt;
                            </Button>
                            <Button className="page-button last" variant='outlined' onClick={handleLastButtonPress} disabled={currentPage === lastPage}>
                                ≫
                            </Button>
                        </Stack>

                    </td>
                </tr>
                <tr className='footer-dropdown' style={{justifyContent: 'flex-end'}}>
                    <td style={{width: 80}}>
                        <FormControl fullWidth size='small' variant='outlined'>
                            <InputLabel id="page-size-select-label">Page Size</InputLabel>
                            <Select
                                labelId="page-size-select-label"
                                id="page-size-select"
                                value={pagination.perPage}
                                label="Page Size"
                                onChange={(event, data) => handlePageSelection(event.target.value as number)}
                            >
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                            </Select>
                        </FormControl>
                    </td>
                </tr>
            </tfoot>
        )
    }

    return (
        <Footer />
    )

}

export {
    GridFooter,
    GridFooterProps
};