import React from 'react';
import { Dropdown, DropdownItemProps, Icon } from 'semantic-ui-react';
import { GridPagination } from '../models/gridPagination';
import { Pagination } from '../models/pagination';
import { Button } from 'semantic-ui-react';

type TableFooterProps = {
    pagination: Pagination,
    handleGridPagination: (gridPagination: GridPagination) => void
}

const TableFooter = (props: TableFooterProps) => {
    const {pagination, handleGridPagination} = props;
    const {currentPage, lastPage, perPage } = pagination;
    let pageButtonIndexes = [1,2,3,4,5,6,7,8,9,10];
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
        pageButtonIndexes = firstHalfConcat.concat([currentPage]).concat(lastHalfConcat);
    }

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
        props.handleGridPagination({page: newPage, take});
    }

    const renderWebFooter = () => {
        return (
            <tfoot className="table-footer-web">
                <tr>
                    <td>
                        <Button className="page-button end" basic onClick={() => handleGridPagination({page: 1, take: perPage})}>
                            <Icon name="arrow left" />
                        </Button>
                    </td>
                    {pageButtonIndexes.map(i => {
                        return (
                            <td key={i}>
                                <Button className="page-button" basic={currentPage !== i} onClick={() => handleGridPagination({page: i, take: perPage})}>{i}</Button>
                            </td>
                        )
                    })}
                    <td>
                        <Button className="page-button end" basic onClick={() => handleGridPagination({page: lastPage, take: perPage})}>
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
                    <td>
                        <Button className="page-button end" basic onClick={() => handleGridPagination({page: 1, take: perPage})}>
                            <Icon name="arrow left" />
                        </Button>
                    </td>
                    {pageButtonIndexes.map(i => {
                        return (
                            <td key={i}>
                                <Button className="page-button" basic={currentPage !== i} onClick={() => handleGridPagination({page: i, take: perPage})}>{i}</Button>
                            </td>
                        )
                    })}
                    <td>
                        <Button className="page-button end" basic onClick={() => handleGridPagination({page: lastPage, take: perPage})}>
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

    return (
        <>
            {renderWebFooter()}
            {renderMobileFooter()}
        </>
    )

}

export {
    TableFooter,
    TableFooterProps
};