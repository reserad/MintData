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

function getPageButtonIndexes(defaultPageNumbers: number[], currentPage: number, lastPage: number) {
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

    return defaultPageNumbers;
}

const GridFooter = (props: GridFooterProps) => {
    const {pagination, onGridChange, gridFilters} = props;
    const {currentPage, lastPage, perPage } = pagination;
    const pageButtonIndexes = getPageButtonIndexes([1,2,3,4,5,6,7,8,9,10], currentPage, lastPage);

    const handlePageSelection = (take: number) => {
        let newPage = 1;
        if (currentPage !== 1) {
            let from = props.pagination.from;
            while (from >= take) {
                from -= take;
                newPage++;
            }
        }
        onGridChange({...gridFilters, page: newPage, take});
    }

    const Footer = () => {
        return (
            <tfoot>
                <tr>
                    <td>
                        <Stack spacing={1} direction='row'>
                            <Button className="page-button previous" variant='outlined' onClick={() =>  onGridChange({...gridFilters, page: currentPage === 1 ? 1 : currentPage-1, take: perPage})} disabled={currentPage === 1}>
                                &lt;
                            </Button>
                            <Button className="page-button begin" variant='outlined' onClick={() =>  onGridChange({...gridFilters, page: 1, take: perPage})} disabled={currentPage === 1}>
                                ≪
                            </Button>
                            {pageButtonIndexes.map((pageNumber, i) => {
                                return (
                                    <Button key={`footer-button-${pageNumber}`} className="page-button number" variant={currentPage !== pageNumber ? 'outlined' : 'contained'} onClick={() =>  onGridChange({...gridFilters, page: pageNumber, take: perPage})}>{pageNumber}</Button>
                                )
                            })}
                            <Button className="page-button end" variant='outlined' onClick={() =>  onGridChange({...gridFilters, page: lastPage, take: perPage})} disabled={currentPage === lastPage}>
                                ≫
                            </Button>
                            <Button className="page-button next" variant='outlined' onClick={() =>  onGridChange({...gridFilters, page: currentPage === lastPage ? lastPage : currentPage+1, take: perPage})} disabled={currentPage === lastPage}>
                                &gt;
                            </Button>
                        </Stack>

                    </td>
                </tr>
                <tr className='footer-dropdown' style={{justifyContent: 'flex-end'}}>
                    <td style={{width: 80}}>
                        <FormControl fullWidth size='small' variant='outlined'>
                            <InputLabel id="demo-simple-select-label">Page Size</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={pagination.perPage}
                                label="Age"
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