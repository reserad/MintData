import React from 'react';
import { Dropdown, DropdownItemProps, Icon } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
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

    const dropdownOptions: DropdownItemProps[] = [20, 50, 100].map(item => {
        return {
            key: item,
            text: `${item} per page`,
            value: item
        }
    });

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

    const renderWebFooter = () => {
        return (
            <tfoot className="table-footer-web">
                <tr>
                    <td>
                        <Button className="page-button end" basic onClick={() =>  onGridChange({...gridFilters, page: 1, take: perPage})} disabled={currentPage === 1}>
                            <Icon name="arrow left" />
                        </Button>
                    </td>
                    {pageButtonIndexes.map(i => {
                        return (
                            <td key={i}>
                                <Button className="page-button" basic={currentPage !== i} onClick={() =>  onGridChange({...gridFilters, page: i, take: perPage})}>{i}</Button>
                            </td>
                        )
                    })}
                    <td>
                        <Button className="page-button end" basic onClick={() =>  onGridChange({...gridFilters, page: lastPage, take: perPage})} disabled={currentPage === lastPage}>
                            <Icon name="arrow right" />
                        </Button>
                    </td>
                </tr>
                <tr style={{justifyContent: 'flex-end'}}>
                    <td>
                        <Dropdown
                            className="page-size-dropdown"
                            onChange={(event, data) => handlePageSelection(data.value as number)}
                            fluid
                            selection
                            options={dropdownOptions} 
                            defaultValue={20}/>
                    </td>
                </tr>
            </tfoot>
        )
    }

    const renderMobileFooter = () => {
        return (
            <tfoot className="table-footer-mobile">
                <tr>
                    <td style={{flex: 1}}>
                        <Button className="page-button end" basic onClick={() =>  onGridChange({...gridFilters, page: currentPage === 1 ? 1 : currentPage-1, take: perPage})} disabled={currentPage === 1}>
                            <Icon name="arrow left" />
                        </Button>
                    </td>
                    <td>
                        <Button className="page-button end" basic onClick={() =>  onGridChange({...gridFilters, page: currentPage === lastPage ? lastPage : currentPage+1, take: perPage})} disabled={currentPage === lastPage}>
                            <Icon name="arrow right" />
                        </Button>
                    </td>
                </tr>
            </tfoot>
        )
    }

    return (
        <>
            {renderWebFooter()}
            {renderMobileFooter()}
        </>
    )

}

export {
    GridFooter,
    GridFooterProps
};